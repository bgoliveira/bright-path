import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  const profile = profileData as Pick<
    Profile,
    "full_name" | "email" | "avatar_url"
  > | null;

  const userInfo = profile
    ? {
        fullName: profile.full_name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="parent" user={userInfo} />
      <main className="ml-64">{children}</main>
    </div>
  );
}
