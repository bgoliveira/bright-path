import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  getClassroomClient,
  fetchAssignments,
  fetchSubmissions,
} from "@/lib/google/classroom";
import {
  calculateSmartStart,
  assignmentToInput,
  recommendationToDb,
} from "@/lib/algorithms/smart-start";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only in this context
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();
    const body = await request.json().catch(() => ({}));
    const courseId = body.courseId; // Optional: sync specific course

    // Get user's Google refresh token
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("google_refresh_token")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.google_refresh_token) {
      return NextResponse.json(
        { error: "No Google account connected" },
        { status: 400 }
      );
    }

    // Get courses to sync
    const coursesQuery = supabase
      .from("courses")
      .select("id, google_course_id")
      .eq("student_id", user.id);

    if (courseId) {
      coursesQuery.eq("id", courseId);
    }

    const { data: courses, error: coursesError } = await coursesQuery;

    if (coursesError || !courses?.length) {
      return NextResponse.json(
        { error: "No courses found. Sync courses first." },
        { status: 400 }
      );
    }

    const classroom = await getClassroomClient(profile.google_refresh_token);
    let totalSynced = 0;
    const allAssignments = [];

    // Sync assignments for each course
    for (const course of courses) {
      const assignments = await fetchAssignments(classroom, course.google_course_id);

      for (const assignment of assignments) {
        // Upsert assignment
        const { data: assignmentData, error: assignmentError } = await supabase
          .from("assignments")
          .upsert(
            {
              course_id: course.id,
              google_assignment_id: assignment.id,
              title: assignment.title,
              description: assignment.description,
              due_date: assignment.dueDate?.toISOString(),
              due_time: assignment.dueTime,
              max_points: assignment.maxPoints,
              work_type: assignment.workType || "assignment",
              state: assignment.state,
              materials: assignment.materials
                ? JSON.stringify(assignment.materials)
                : null,
            },
            {
              onConflict: "course_id,google_assignment_id",
            }
          )
          .select()
          .single();

        if (assignmentError) {
          console.error("Assignment upsert error:", assignmentError);
          continue;
        }

        allAssignments.push(assignmentData);
        totalSynced++;

        // Fetch and upsert submission
        const submissions = await fetchSubmissions(
          classroom,
          course.google_course_id,
          assignment.id
        );

        for (const submission of submissions) {
          await supabase.from("submissions").upsert(
            {
              assignment_id: assignmentData.id,
              student_id: user.id,
              state: submission.state,
              assigned_grade: submission.assignedGrade,
              draft_grade: submission.draftGrade,
              late: submission.late,
              last_synced_at: new Date().toISOString(),
            },
            {
              onConflict: "assignment_id,student_id",
            }
          );
        }
      }
    }

    // Calculate Smart Start recommendations
    if (allAssignments.length > 0) {
      const recommendations = await calculateSmartStart(
        allAssignments.map(assignmentToInput)
      );

      // Store recommendations
      for (const rec of recommendations) {
        await supabase.from("assignment_recommendations").upsert(
          recommendationToDb(rec, user.id),
          {
            onConflict: "assignment_id,student_id",
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      synced: totalSynced,
    });
  } catch (error) {
    console.error("Assignment sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync assignments" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();

    // Get assignments with course info and recommendations
    const { data: assignments, error } = await supabase
      .from("assignments")
      .select(
        `
        *,
        course:courses!inner(id, name, teacher_name),
        submission:submissions!left(state, assigned_grade, late),
        recommendation:assignment_recommendations!left(
          recommended_start_date,
          complexity_score,
          estimated_hours,
          priority_rank,
          reasoning
        )
      `
      )
      .eq("courses.student_id", user.id)
      .not("due_date", "is", null)
      .gte("due_date", new Date().toISOString())
      .order("due_date");

    if (error) {
      throw error;
    }

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Get assignments error:", error);
    return NextResponse.json(
      { error: "Failed to get assignments" },
      { status: 500 }
    );
  }
}
