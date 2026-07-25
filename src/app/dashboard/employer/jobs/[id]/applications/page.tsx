"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useJob } from "@/hooks/use-jobs";
import { useJobApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { apiErrorMessage } from "@/lib/api";
import type { ApplicationStatus } from "@/types";

const STATUS_OPTIONS: ApplicationStatus[] = ["applied", "reviewed", "interview", "hired", "rejected"];

export default function JobApplicationsPage() {
  const params = useParams();
  const jobId = Number(params.id);

  const { data: job } = useJob(jobId);
  const { data: applications, isLoading } = useJobApplications(jobId);
  const updateStatus = useUpdateApplicationStatus();

  function handleStatusChange(applicationId: number, status: ApplicationStatus) {
    updateStatus.mutate(
      { id: applicationId, status },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: (err) => toast.error(apiErrorMessage(err)),
      }
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold text-ink">{job ? `Applicants for ${job.title}` : "Applicants"}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {applications ? `${applications.length} application${applications.length === 1 ? "" : "s"}` : ""}
      </p>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="flex justify-center py-12 text-ink-faint">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {applications?.length === 0 && (
          <div className="rounded-lg border border-line bg-white p-10 text-center text-sm text-ink-soft">
            No applications yet for this role.
          </div>
        )}

        {applications?.map((app) => (
          <Card key={app.id}>
            <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">Candidate #{app.candidate_id}</p>
                <p className="text-xs text-ink-faint mt-0.5">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </p>
                {app.cover_letter && (
                  <p className="mt-2 text-sm text-ink-soft max-w-md line-clamp-3">{app.cover_letter}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={app.status} />
                <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}>
                  <SelectTrigger className="w-36 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
