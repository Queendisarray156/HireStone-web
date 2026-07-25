"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ApplicationPipeline } from "@/components/dashboard/application-pipeline";
import { useMyApplications } from "@/hooks/use-applications";
import { useMyCandidateProfile, useUpdateCandidateProfile } from "@/hooks/use-profile";
import { useJob } from "@/hooks/use-jobs";
import { apiErrorMessage } from "@/lib/api";
import type { Application } from "@/types";

function ApplicationRow({ application }: { application: Application }) {
  const { data: job } = useJob(application.job_id);
  return (
    <Card>
      <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href={`/jobs/${application.job_id}`} className="font-medium text-ink hover:text-brand-500">
            {job?.title ?? `Job #${application.job_id}`}
          </Link>
          <p className="text-xs text-ink-faint mt-0.5">
            Applied {new Date(application.applied_at).toLocaleDateString()}
          </p>
        </div>
        <ApplicationPipeline status={application.status} />
      </CardBody>
    </Card>
  );
}

function ApplicationsTab() {
  const { data: applications, isLoading } = useMyApplications();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 text-ink-faint">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white p-10 text-center">
        <p className="font-medium text-ink">No applications yet</p>
        <p className="mt-1 text-sm text-ink-soft">
          <Link href="/jobs" className="text-brand-500 underline underline-offset-2">
            Browse open roles
          </Link>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((a) => (
        <ApplicationRow key={a.id} application={a} />
      ))}
    </div>
  );
}

function ProfileTab() {
  const { data: profile, isLoading } = useMyCandidateProfile();
  const update = useUpdateCandidateProfile();
  const [form, setForm] = useState({ full_name: "", phone: "", headline: "" });
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setForm({ full_name: profile.full_name, phone: profile.phone ?? "", headline: profile.headline ?? "" });
    setInitialized(true);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 text-ink-faint">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    update.mutate(form, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (err) => toast.error(apiErrorMessage(err)),
    });
  }

  return (
    <Card className="max-w-lg">
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <Button type="submit" loading={update.isPending}>
            Save changes
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default function CandidateDashboardPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Your dashboard</h1>
        <Link href="/dashboard/candidate/resumes" className="text-sm font-medium text-brand-500 flex items-center gap-1.5">
          <FileText className="h-4 w-4" /> Manage resumes
        </Link>
      </div>

      <Tabs defaultValue="applications" className="mt-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
