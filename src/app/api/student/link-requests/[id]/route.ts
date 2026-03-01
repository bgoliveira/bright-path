import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile, StudentParentLink, Database } from "@/types";

type StudentParentLinkUpdate =
  Database["public"]["Tables"]["student_parent_links"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is a student
    const { data: studentProfileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const studentProfile = studentProfileData as Pick<Profile, "role"> | null;

    if (!studentProfile || studentProfile.role !== "student") {
      return NextResponse.json(
        { error: "Only students can respond to link requests" },
        { status: 403 }
      );
    }

    // Get the link request
    const { data: linkData, error: linkError } = await supabase
      .from("student_parent_links")
      .select("*")
      .eq("id", id)
      .single();

    const link = linkData as StudentParentLink | null;

    if (linkError || !link) {
      return NextResponse.json(
        { error: "Link request not found" },
        { status: 404 }
      );
    }

    // Verify the link belongs to this student
    if (link.student_id !== user.id) {
      return NextResponse.json(
        { error: "This link request does not belong to you" },
        { status: 403 }
      );
    }

    // Get status from request body
    const body = await request.json();
    const { status } = body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    // Update the link status
    const updateData: StudentParentLinkUpdate = {
      status: status as "accepted" | "rejected",
    };
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
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `Link request ${status}`,
    });
  } catch (error) {
    console.error("Update link request error:", error);
    return NextResponse.json(
      { error: "Failed to update link request" },
      { status: 500 }
    );
  }
}
