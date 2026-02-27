import { Sidebar } from "@/components/layout/Sidebar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="parent" />
      <main className="ml-64">{children}</main>
    </div>
  );
}
