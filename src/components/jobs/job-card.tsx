import Link from "next/link";
import { MapPin, Building2, Clock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobListing } from "@/types";
import { formatJobType, formatSalary, timeAgo } from "@/lib/utils";

export function JobCard({ job }: { job: JobListing }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover:border-brand-300 hover:shadow-pop transition-all">
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">{job.title}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> Employer #{job.employer_id}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-sm text-ink-soft whitespace-nowrap">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
          </div>

          <p className="text-sm text-ink-soft line-clamp-2">{job.description}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <Badge variant="brand">{formatJobType(job.job_type)}</Badge>
              {job.remote && <Badge variant="accent">Remote</Badge>}
            </div>
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <Clock className="h-3.5 w-3.5" /> {timeAgo(job.created_at)}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
