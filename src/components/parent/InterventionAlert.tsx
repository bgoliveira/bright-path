import { AlertOctagon } from "lucide-react";
import type { InterventionItem } from "@/types/parent";

interface InterventionAlertProps {
  interventions: InterventionItem[];
}

export function InterventionAlert({ interventions }: InterventionAlertProps) {
  if (interventions.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800">Action Required</p>
          <ul className="mt-2 space-y-2">
            {interventions.map((intervention, index) => (
              <li key={index} className="text-sm text-red-700">
                <span className="font-medium">{intervention.message}</span>
                {intervention.details && intervention.details.length > 0 && (
                  <ul className="mt-1 ml-4 space-y-0.5">
                    {intervention.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="text-xs text-red-600">
                        {detail}
                      </li>
                    ))}
                    {intervention.details.length > 3 && (
                      <li className="text-xs text-red-500">
                        +{intervention.details.length - 3} more
                      </li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
