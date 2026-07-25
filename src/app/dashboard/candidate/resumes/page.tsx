"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { FileText, Star, Trash2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useMyResumes, useUploadResume, useSetPrimaryResume, useDeleteResume } from "@/hooks/use-resumes";
import { apiErrorMessage } from "@/lib/api";

function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function ResumesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: resumes, isLoading } = useMyResumes();
  const upload = useUploadResume();
  const setPrimary = useSetPrimaryResume();
  const del = useDeleteResume();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate(file, {
      onSuccess: () => toast.success("Resume uploaded"),
      onError: (err) => toast.error(apiErrorMessage(err)),
    });
    e.target.value = "";
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-semibold text-ink">Your resumes</h1>
      <p className="mt-1 text-sm text-ink-soft">PDF or Word docs, up to 5MB. The primary resume is pre-selected when you apply.</p>

      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
      <Button className="mt-6" onClick={() => inputRef.current?.click()} loading={upload.isPending}>
        <Upload className="h-4 w-4" /> Upload resume
      </Button>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="flex justify-center py-12 text-ink-faint">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {resumes?.length === 0 && (
          <div className="rounded-lg border border-line bg-white p-10 text-center text-sm text-ink-soft">
            No resumes yet. Upload one to start applying.
          </div>
        )}

        {resumes?.map((r) => (
          <Card key={r.id}>
            <CardBody className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">{r.filename}</p>
                  <p className="text-xs text-ink-faint">
                    {formatBytes(r.size_bytes)} · uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                    {r.is_primary && <span className="text-accent-600 font-medium"> · Primary</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!r.is_primary && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Set as primary"
                    onClick={() => setPrimary.mutate(r.id, { onError: (err) => toast.error(apiErrorMessage(err)) })}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  title="Delete"
                  onClick={() => del.mutate(r.id, { onError: (err) => toast.error(apiErrorMessage(err)) })}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
