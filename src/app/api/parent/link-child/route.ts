import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile, StudentParentLink, Database } from "@/types";

type StudentParentLinkInsert =
  Database["public"]["Tables"]["student_parent_links"]["Insert"];
type StudentParentLinkUpdate =
  Database["public"]["Tables"]["student_parent_links"]["Update"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a parent
    const { data: parentProfileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const parentProfile = parentProfileData as Pick<Profile, "role"> | null;

    if (!parentProfile || parentProfile.role !== "parent") {
      return NextResponse.json(
        { error: "Only parents can send link requests" },
        { status: 403 }
      );
    }

    // Get student email from request body
    const body = await request.json();
    const { studentEmail } = body;

    if (!studentEmail || typeof studentEmail !== "string") {
      return NextResponse.json(
        { error: "Student email is required" },
        { status: 400 }
      );
    }

    // Find student by email
    const { data: studentProfileData, error: studentError } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("email", studentEmail.toLowerCase().trim())
      .single();

    const studentProfile = studentProfileData as Pick<
      Profile,
      "id" | "role" | "full_name"
    > | null;

    if (studentError || !studentProfile) {
      return NextResponse.json(
        { error: "No student found with this email address" },
        { status: 404 }
      );
    }

    if (studentProfile.role !== "student") {
      return NextResponse.json(
        { error: "This email does not belong to a student account" },
        { status: 400 }
      );
    }

    // Check if link already exists
    const { data: existingLinkData } = await supabase
      .from("student_parent_links")
      .select("id, status")
      .eq("student_id", studentProfile.id)
      .eq("parent_id", user.id)
      .single();

    const existingLink = existingLinkData as Pick<
      StudentParentLink,
      "id" | "status"
    > | null;

    if (existingLink) {
      if (existingLink.status === "accepted") {
        return NextResponse.json(
          { error: "You are already linked to this student" },
          { status: 400 }
        );
      }
      if (existingLink.status === "pending") {
        return NextResponse.json(
          { error: "A link request is already pending for this student" },
          { status: 400 }
        );
      }
      if (existingLink.status === "rejected") {
        // Update rejected link to pending (allow retry)
        const updateData: StudentParentLinkUpdate = { status: "pending" };
        // Cast to bypass RLS type constraints (runtime RLS allows this)
        const { error: updateError } = await (supabase as unknown as {
          from: (table: string) => {
            update: (data: StudentParentLinkUpdate) => {
              eq: (col: string, val: string) => Promise<{ error: Error | null }>;
            };
          };
        })
          .from("student_parent_links")
          .update(updateData)
          .eq("id", existingLink.id);

        if (updateError) {
          throw updateError;
        }

        return NextResponse.json({
          success: true,
          message: "Link request sent successfully",
        });
      }
    }

    // Create new link request
    const insertData: StudentParentLinkInsert = {
      student_id: studentProfile.id,
      parent_id: user.id,
      status: "pending",
    };
    // Cast to bypass RLS type constraints (runtime RLS allows this)
    const { error: insertError } = await (supabase as unknown as {
      from: (table: string) => {
        insert: (data: StudentParentLinkInsert) => Promise<{ error: Error | null }>;
      };
    })
      .from("student_parent_links")
      .insert(insertData);

    if (insertError) {
      console.error("Insert link error:", insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Link request sent successfully",
    });
  } catch (error) {
    console.error("Link child error:", error);
    return NextResponse.json(
      { error: "Failed to send link request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all link requests sent by this parent
    const { data: linksData, error } = await supabase
      .from("student_parent_links")
      .select("id, status, created_at, student_id")
      .eq("parent_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const links = (linksData || []) as Pick<
      StudentParentLink,
      "id" | "status" | "created_at" | "student_id"
    >[];

    // Get student profiles for each link
    const studentIds = links.map((link) => link.student_id);

    if (studentIds.length === 0) {
      return NextResponse.json({ links: [] });
    }

    const { data: studentsData } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", studentIds);

    const students = (studentsData || []) as Pick<
      Profile,
      "id" | "full_name" | "email"
    >[];

    const studentMap = new Map(students.map((s) => [s.id, s]));

    const linksWithStudents = links.map((link) => ({
      ...link,
      student: studentMap.get(link.student_id) || null,
    }));

    return NextResponse.json({ links: linksWithStudents });
  } catch (error) {
    console.error("Get links error:", error);
    return NextResponse.json(
      { error: "Failed to get link requests" },
      { status: 500 }
    );
  }
}
