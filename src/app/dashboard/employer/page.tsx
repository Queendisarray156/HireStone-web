"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, MapPin, Users, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyEmployerProfile } from "@/hooks/use-profile";
import { useMyJobs, useCreateJob, useUpdateJob } from "@/hooks/use-jobs";
import { apiErrorMessage } from "@/lib/api";
import { formatJobType, formatSalary } from "@/lib/utils";
import type { JobType } from "@/types";

function PostJobDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    remote: false,
    job_type: "full_time" as JobType,
    salary_min: "",
    salary_max: "",
  });
  const create = useCreateJob();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate(
      {
        title: form.title,
        description: form.description,
        location: form.location || undefined,
        remote: form.remote,
        job_type: form.job_type,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Job posted");
          setOpen(false);
          setForm({ title: "", description: "", location: "", remote: false, job_type: "full_time", salary_min: "", salary_max: "" });
        },
        onError: (err) => toast.error(apiErrorMessage(err)),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Post a job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold text-ink">Post a new role</DialogTitle>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="title">Job title</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div>
              <Label>Job type</Label>
              <Select value={form.job_type} onValueChange={(v) => setForm((f) => ({ ...f, job_type: v as JobType }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time</SelectItem>
                  <SelectItem value="part_time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="salary_min">Salary min (optional)</Label>
              <Input
                id="salary_min"
                type="number"
                value={form.salary_min}
                onChange={(e) => setForm((f) => ({ ...f, salary_min: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="salary_max">Salary max (optional)</Label>
              <Input
                id="salary_max"
                type="number"
                value={form.salary_max}
                onChange={(e) => setForm((f) => ({ ...f, salary_max: e.target.value }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.remote}
              onChange={(e) => setForm((f) => ({ ...f, remote: e.target.checked }))}
              className="h-4 w-4 rounded border-line accent-brand-500"
            />
            Remote friendly
          </label>
          <Button type="submit" className="w-full" loading={create.isPending}>
            Publish job
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EmployerDashboardPage() {
  const { data: profile } = useMyEmployerProfile();
  const { data: jobs, isLoading } = useMyJobs(profile?.id);
  const updateJob = useUpdateJob();

  function toggleStatus(id: number, current: string) {
    updateJob.mutate(
      { id, payload: { status: current === "open" ? "closed" : "open" } },
      {
        onSuccess: () => toast.success(current === "open" ? "Job closed" : "Job reopened"),
        onError: (err) => toast.error(apiErrorMessage(err)),
      }
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{profile?.company_name ?? "Your jobs"}</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage postings and review applicants.</p>
        </div>
        <PostJobDialog />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="flex justify-center py-12 text-ink-faint">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {jobs?.items.length === 0 && (
          <div className="rounded-lg border border-line bg-white p-10 text-center text-sm text-ink-soft">
            No jobs posted yet. Click "Post a job" to publish your first role.
          </div>
        )}

        {jobs?.items.map((job) => (
          <Card key={job.id}>
            <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{job.title}</p>
                  <Badge variant={job.status === "open" ? "accent" : "neutral"}>{job.status}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                  )}
                  <span>{formatJobType(job.job_type)}</span>
                  <span className="font-mono">{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/employer/jobs/${job.id}/applications`}>
                    <Users className="h-4 w-4" /> Applicants
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleStatus(job.id, job.status)} title="Toggle status">
                  <Ban className="h-4 w-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
