import { google, classroom_v1 } from "googleapis";
import { getOAuth2Client, decryptToken, refreshAccessToken } from "./oauth";

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  ownerId?: string;
  enrollmentCode?: string;
  courseState?: string;
}

export interface ClassroomAssignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  dueTime?: string;
  maxPoints?: number;
  workType?: string;
  state?: string;
  materials?: classroom_v1.Schema$Material[];
}

export interface ClassroomSubmission {
  id: string;
  courseWorkId: string;
  userId: string;
  state?: string;
  assignedGrade?: number;
  draftGrade?: number;
  late?: boolean;
}

/**
 * Create an authenticated Classroom client
 */
export async function getClassroomClient(
  encryptedRefreshToken: string
): Promise<classroom_v1.Classroom> {
  const refreshToken = decryptToken(encryptedRefreshToken);
  const oauth2Client = getOAuth2Client();

  // Set the refresh token
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Get a fresh access token
  const credentials = await refreshAccessToken(refreshToken);
  oauth2Client.setCredentials(credentials);

  return google.classroom({ version: "v1", auth: oauth2Client });
}

/**
 * Fetch all courses for the authenticated user
 */
export async function fetchCourses(
  classroom: classroom_v1.Classroom,
  studentId?: string
): Promise<ClassroomCourse[]> {
  const courses: ClassroomCourse[] = [];
  let pageToken: string | undefined;

  do {
    const response = await classroom.courses.list({
      studentId: studentId || "me",
      courseStates: ["ACTIVE"],
      pageSize: 100,
      pageToken,
    });

    if (response.data.courses) {
      for (const course of response.data.courses) {
        courses.push({
          id: course.id || "",
          name: course.name || "Untitled Course",
          section: course.section || undefined,
          descriptionHeading: course.descriptionHeading || undefined,
          room: course.room || undefined,
          ownerId: course.ownerId || undefined,
          enrollmentCode: course.enrollmentCode || undefined,
          courseState: course.courseState || undefined,
        });
      }
    }

    pageToken = response.data.nextPageToken || undefined;
  } while (pageToken);

  return courses;
}

/**
 * Fetch all assignments (coursework) for a course
 */
export async function fetchAssignments(
  classroom: classroom_v1.Classroom,
  courseId: string
): Promise<ClassroomAssignment[]> {
  const assignments: ClassroomAssignment[] = [];
  let pageToken: string | undefined;

  do {
    const response = await classroom.courses.courseWork.list({
      courseId,
      courseWorkStates: ["PUBLISHED"],
      pageSize: 100,
      pageToken,
    });

    if (response.data.courseWork) {
      for (const work of response.data.courseWork) {
        let dueDate: Date | undefined;
        let dueTime: string | undefined;

        if (work.dueDate) {
          dueDate = new Date(
            work.dueDate.year || 2024,
            (work.dueDate.month || 1) - 1,
            work.dueDate.day || 1
          );

          if (work.dueTime) {
            dueTime = `${work.dueTime.hours || 0}:${work.dueTime.minutes || 0}`;
          }
        }

        assignments.push({
          id: work.id || "",
          courseId: courseId,
          title: work.title || "Untitled Assignment",
          description: work.description || undefined,
          dueDate,
          dueTime,
          maxPoints: work.maxPoints || undefined,
          workType: work.workType || undefined,
          state: work.state || undefined,
          materials: work.materials || undefined,
        });
      }
    }

    pageToken = response.data.nextPageToken || undefined;
  } while (pageToken);

  return assignments;
}

/**
 * Fetch student submissions for a course
 */
export async function fetchSubmissions(
  classroom: classroom_v1.Classroom,
  courseId: string,
  courseWorkId: string,
  userId?: string
): Promise<ClassroomSubmission[]> {
  const submissions: ClassroomSubmission[] = [];

  try {
    const response = await classroom.courses.courseWork.studentSubmissions.list(
      {
        courseId,
        courseWorkId,
        userId: userId || "me",
      }
    );

    if (response.data.studentSubmissions) {
      for (const submission of response.data.studentSubmissions) {
        submissions.push({
          id: submission.id || "",
          courseWorkId: submission.courseWorkId || "",
          userId: submission.userId || "",
          state: submission.state || undefined,
          assignedGrade: submission.assignedGrade || undefined,
          draftGrade: submission.draftGrade || undefined,
          late: submission.late || false,
        });
      }
    }
  } catch (error) {
    console.error(
      `Error fetching submissions for ${courseWorkId}:`,
      error
    );
  }

  return submissions;
}

/**
 * Get teacher name for a course
 */
export async function fetchTeacherName(
  classroom: classroom_v1.Classroom,
  courseId: string,
  ownerId: string
): Promise<string | undefined> {
  try {
    const response = await classroom.courses.teachers.get({
      courseId,
      userId: ownerId,
    });

    return response.data.profile?.name?.fullName || undefined;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return undefined;
  }
}

/**
 * Full sync: Fetch all data for a student
 */
export async function fullSync(encryptedRefreshToken: string): Promise<{
  courses: ClassroomCourse[];
  assignments: Map<string, ClassroomAssignment[]>;
  submissions: Map<string, ClassroomSubmission[]>;
}> {
  const classroom = await getClassroomClient(encryptedRefreshToken);

  // Fetch courses
  const courses = await fetchCourses(classroom);

  // Fetch assignments for each course
  const assignments = new Map<string, ClassroomAssignment[]>();
  const submissions = new Map<string, ClassroomSubmission[]>();

  for (const course of courses) {
    const courseAssignments = await fetchAssignments(classroom, course.id);
    assignments.set(course.id, courseAssignments);

    // Fetch submissions for each assignment
    for (const assignment of courseAssignments) {
      const assignmentSubmissions = await fetchSubmissions(
        classroom,
        course.id,
        assignment.id
      );
      submissions.set(assignment.id, assignmentSubmissions);
    }
  }

  return { courses, assignments, submissions };
}
