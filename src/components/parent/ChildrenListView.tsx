"use client";

import type { ChildSummary } from "@/types/parent";
import { ChildSummaryCard } from "./ChildSummaryCard";
import { EmptyState } from "./EmptyState";

interface ChildrenListViewProps {
  children: ChildSummary[];
}

export function ChildrenListView({ children }: ChildrenListViewProps) {
  if (children.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {children.map((child) => (
        <ChildSummaryCard key={child.id} child={child} />
      ))}
    </div>
  );
}
