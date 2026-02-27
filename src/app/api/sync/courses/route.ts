import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getClassroomClient, fetchCourses, fetchTeacherName } from "@/lib/google/classroom";

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

export async function POST() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();

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

    // Fetch courses from Google Classroom
    const classroom = await getClassroomClient(profile.google_refresh_token);
    const courses = await fetchCourses(classroom);

    // Upsert courses to database
    const syncedCourses = [];

    for (const course of courses) {
      // Get teacher name
      let teacherName: string | undefined;
      if (course.ownerId) {
        teacherName = await fetchTeacherName(classroom, course.id, course.ownerId);
      }

      const { data, error } = await supabase
        .from("courses")
        .upsert(
          {
            student_id: user.id,
            google_course_id: course.id,
            name: course.name,
            section: course.section,
            description_heading: course.descriptionHeading,
            room: course.room,
            teacher_name: teacherName,
            enrollment_code: course.enrollmentCode,
            course_state: course.courseState,
            last_synced_at: new Date().toISOString(),
          },
          {
            onConflict: "student_id,google_course_id",
          }
        )
        .select()
        .single();

      if (!error && data) {
        syncedCourses.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCourses.length,
      courses: syncedCourses,
    });
  } catch (error) {
    console.error("Course sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync courses" },
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

    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("student_id", user.id)
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Failed to get courses" },
      { status: 500 }
    );
  }
}
