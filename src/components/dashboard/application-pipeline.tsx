import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import { Check, X } from "lucide-react";

const STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "reviewed", label: "Reviewed" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
];

const STAGE_ORDER: Record<ApplicationStatus, number> = {
  applied: 0,
  reviewed: 1,
  interview: 2,
  hired: 3,
  rejected: -1,
};

/**
 * Horizontal pipeline stepper. This is the platform's signature element: every
 * application genuinely moves through this sequence, so showing order and
 * position communicates real information, not decoration.
 */
export function ApplicationPipeline({ status }: { status: ApplicationStatus }) {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 text-sm text-danger">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF3F2]">
          <X className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium">Not moving forward</span>
      </div>
    );
  }

  const currentIndex = STAGE_ORDER[status];

  return (
    <div className="flex items-center" role="list" aria-label="Application progress">
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const isLast = i === STAGES.length - 1;

        return (
          <div key={stage.key} className="flex items-center" role="listitem">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                  done && "bg-accent-500 text-white",
                  active && "bg-brand-500 text-white ring-4 ring-brand-50",
                  !done && !active && "bg-surface-sunk text-ink-faint border border-line"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap",
                  active ? "text-ink" : "text-ink-faint"
                )}
              >
                {stage.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "h-[2px] w-8 sm:w-12 -mt-4",
                  done ? "bg-accent-500" : "bg-line"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
