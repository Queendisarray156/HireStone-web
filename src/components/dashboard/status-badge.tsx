import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types";

const CONFIG: Record<ApplicationStatus, { label: string; variant: "brand" | "accent" | "danger" | "neutral" | "warn" }> = {
  applied: { label: "Applied", variant: "neutral" },
  reviewed: { label: "Reviewed", variant: "brand" },
  interview: { label: "Interview", variant: "warn" },
  hired: { label: "Hired", variant: "accent" },
  rejected: { label: "Rejected", variant: "danger" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = CONFIG[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
