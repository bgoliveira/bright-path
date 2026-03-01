import { Users } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
        <Users className="w-8 h-8 text-secondary-400" />
      </div>
      <h2 className="text-xl font-semibold text-secondary-900 mb-2">No Children Linked</h2>
      <p className="text-secondary-500 text-center max-w-md mb-6">
        You haven&apos;t linked any children to your account yet. Link a child to start monitoring
        their academic progress.
      </p>
      <Link
        href="/parent/link-child"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Users className="w-5 h-5" />
        Link a Child
      </Link>
    </div>
  );
}
