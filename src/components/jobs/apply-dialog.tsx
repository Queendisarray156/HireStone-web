"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useMyResumes } from "@/hooks/use-resumes";
import { useApplyToJob } from "@/hooks/use-applications";
import { apiErrorMessage } from "@/lib/api";

export function ApplyDialog({ jobId }: { jobId: number }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [resumeId, setResumeId] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");

  const { data: resumes } = useMyResumes();
  const apply = useApplyToJob();

  if (!user) {
    return (
      <Button size="lg" onClick={() => router.push(`/login?next=/jobs/${jobId}`)}>
        Log in to apply
      </Button>
    );
  }

  if (user.role !== "candidate") {
    return (
      <Button size="lg" variant="outline" disabled>
        Employer accounts can't apply
      </Button>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeId) {
      toast.error("Pick a resume first");
      return;
    }
    apply.mutate(
      { job_id: jobId, resume_id: Number(resumeId), cover_letter: coverLetter || undefined },
      {
        onSuccess: () => {
          toast.success("Application sent");
          setOpen(false);
        },
        onError: (err) => toast.error(apiErrorMessage(err)),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Apply now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold text-ink">Apply to this role</DialogTitle>

        {resumes && resumes.length === 0 ? (
          <div className="mt-4 rounded-md border border-line bg-surface-sunk p-4 text-sm text-ink-soft">
            No resume on file yet.{" "}
            <a href="/dashboard/candidate/resumes" className="text-brand-500 font-medium underline underline-offset-2">
              Upload one
            </a>{" "}
            before applying.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label>Resume</Label>
              <Select value={resumeId} onValueChange={setResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes?.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" /> {r.filename}
                        {r.is_primary && <span className="text-xs text-accent-600">(primary)</span>}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cover letter (optional)</Label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="A few sentences on why you're a fit"
              />
            </div>

            <Button type="submit" className="w-full" loading={apply.isPending}>
              Submit application
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
