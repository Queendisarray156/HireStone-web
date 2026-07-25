"use client";

import { useParams } from "next/navigation";
import { Loader2, MapPin, Building2, Clock, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useJob } from "@/hooks/use-jobs";
import { useEmployer } from "@/hooks/use-profile";
import { ApplyDialog } from "@/components/jobs/apply-dialog";
import { formatJobType, formatSalary, timeAgo } from "@/lib/utils";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = Number(params.id);

  const { data: job, isLoading, isError } = useJob(jobId);
  const { data: employer } = useEmployer(job?.employer_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-ink-faint">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="container py-16 text-center">
        <p className="font-medium text-ink">Job not found</p>
        <p className="mt-1 text-sm text-ink-soft">It may have been closed or removed.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="rounded-lg border border-line bg-white p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{job.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" /> {employer?.company_name ?? `Employer #${job.employer_id}`}
              </span>
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Posted {timeAgo(job.created_at)}
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1 font-mono text-lg text-ink shrink-0">
            <Wallet className="h-4 w-4 text-ink-faint" />
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Badge variant="brand">{formatJobType(job.job_type)}</Badge>
          {job.remote && <Badge variant="accent">Remote</Badge>}
        </div>

        <div className="mt-6 border-t border-line pt-6">
          <h2 className="text-sm font-semibold text-ink mb-2">About this role</h2>
          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {employer?.description && (
          <div className="mt-6 border-t border-line pt-6">
            <h2 className="text-sm font-semibold text-ink mb-2">About {employer.company_name}</h2>
            <p className="text-sm text-ink-soft leading-relaxed">{employer.description}</p>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <ApplyDialog jobId={job.id} />
        </div>
      </div>
    </div>
  );
}
