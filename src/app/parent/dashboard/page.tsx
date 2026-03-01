import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ChildrenListView } from "@/components/parent/ChildrenListView";
import { createClient } from "@/lib/supabase/server";
import { fetchChildrenSummaries } from "@/lib/parent/fetchChildrenSummaries";
import type { Profile } from "@/types";

export default async function ParentDashboard() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify user is a parent
  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = profileData as Pick<Profile, "role"> | null;

  if (!profile || profile.role !== "parent") {
    redirect("/");
  }

  // Fetch children summaries
  const children = await fetchChildrenSummaries(user.id);

  return (
    <div>
      <Header
        title="Parent Dashboard"
        subtitle={
          children.length > 0
            ? `Monitoring ${children.length} ${children.length === 1 ? "child" : "children"}`
            : "Link your children to get started"
        }
      />

      <div className="p-8">
        <ChildrenListView children={children} />
      </div>
    </div>
  );
}
