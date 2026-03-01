import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile, StudentParentLink } from "@/types";

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

    // Get all link requests for this student
    const { data: linksData, error } = await supabase
      .from("student_parent_links")
      .select("id, status, created_at, parent_id")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const links = (linksData || []) as Pick<
      StudentParentLink,
      "id" | "status" | "created_at" | "parent_id"
    >[];

    // Get parent profiles for each link
    const parentIds = links.map((link) => link.parent_id);

    if (parentIds.length === 0) {
      return NextResponse.json({ links: [] });
    }

    const { data: parentsData } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", parentIds);

    const parents = (parentsData || []) as Pick<
      Profile,
      "id" | "full_name" | "email"
    >[];

    const parentMap = new Map(parents.map((p) => [p.id, p]));

    const linksWithParents = links.map((link) => ({
      ...link,
      parent: parentMap.get(link.parent_id) || null,
    }));

    return NextResponse.json({ links: linksWithParents });
  } catch (error) {
    console.error("Get link requests error:", error);
    return NextResponse.json(
      { error: "Failed to get link requests" },
      { status: 500 }
    );
  }
}
