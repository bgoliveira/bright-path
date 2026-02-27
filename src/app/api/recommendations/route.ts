import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServiceClient();
    const today = new Date().toISOString().split("T")[0];

    // Get top recommendations with assignment and course details
    const { data: recommendations, error } = await supabase
      .from("assignment_recommendations")
      .select(
        `
        *,
        assignment:assignments!inner(
          id,
          title,
          description,
          due_date,
          max_points,
          course:courses!inner(id, name, teacher_name)
        )
      `
      )
      .eq("student_id", user.id)
      .gte("assignment.due_date", today)
      .order("priority_rank", { ascending: true })
      .limit(10);

    if (error) {
      throw error;
    }

    // Transform to friendly format
    const transformed = recommendations.map((rec) => {
      const dueDate = new Date(rec.assignment.due_date);
      const startDate = new Date(rec.recommended_start_date);
      const now = new Date();

      // Determine priority status
      let priority: "start-now" | "start-soon" | "on-track" | "behind";
      const daysUntilStart = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilStart < 0) {
        priority = "behind";
      } else if (daysUntilStart === 0) {
        priority = "start-now";
      } else if (daysUntilStart <= 2) {
        priority = "start-soon";
      } else {
        priority = "on-track";
      }

      return {
        id: rec.id,
        assignmentId: rec.assignment.id,
        title: rec.assignment.title,
        courseName: rec.assignment.course.name,
        teacherName: rec.assignment.course.teacher_name,
        dueDate: dueDate.toISOString(),
        recommendedStartDate: startDate.toISOString(),
        complexityScore: rec.complexity_score,
        estimatedHours: rec.estimated_hours,
        priorityRank: rec.priority_rank,
        reasoning: rec.reasoning,
        priority,
      };
    });

    return NextResponse.json({ recommendations: transformed });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
