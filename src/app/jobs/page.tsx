"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/jobs/job-card";
import { useJobSearch } from "@/hooks/use-jobs";
import type { JobType } from "@/types";

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

function JobsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const jobType = (searchParams.get("job_type") as JobType | null) ?? undefined;
  const remote = searchParams.get("remote") === "true" ? true : undefined;
  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading, isError } = useJobSearch({
    q: q || undefined,
    location: location || undefined,
    job_type: jobType,
    remote,
    page,
    page_size: 10,
  });

  function updateParams(next: Record<string, string | undefined>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (resetPage) params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  function goToPage(nextPage: number) {
    updateParams({ page: String(nextPage) }, false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q, location });
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold text-ink">Find your next role</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {data ? `${data.total} open role${data.total === 1 ? "" : "s"}` : "Searching open roles"}
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title or keyword" className="pl-9" />
        </div>
        <div className="relative sm:w-56">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="pl-9" />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        <SlidersHorizontal className="h-4 w-4" />

        <Select value={jobType ?? "any"} onValueChange={(v) => updateParams({ job_type: v === "any" ? undefined : v })}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any job type</SelectItem>
            {JOB_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={remote === true ? "remote" : "any"}
          onValueChange={(v) => updateParams({ remote: v === "remote" ? "true" : undefined })}
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Remote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">On-site or remote</SelectItem>
            <SelectItem value="remote">Remote only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-ink-faint">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-ink-soft">
            Couldn't load jobs. Check the API is running and try again.
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="rounded-lg border border-line bg-white p-10 text-center">
            <p className="font-medium text-ink">No roles match those filters</p>
            <p className="mt-1 text-sm text-ink-soft">Try a broader keyword or clear the location filter.</p>
          </div>
        )}

        {data?.items.map((job) => <JobCard key={job.id} job={job} />)}
      </div>

      {data && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-ink-soft">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsPageInner />
    </Suspense>
  );
}
