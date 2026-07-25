import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application, ApplicationStatus } from "@/types";

export function useMyApplications() {
  return useQuery({
    queryKey: ["applications", "mine"],
    queryFn: async () => {
      const { data } = await api.get<Application[]>("/applications/mine");
      return data;
    },
  });
}

export function useJobApplications(jobId?: number) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: async () => {
      const { data } = await api.get<Application[]>(`/applications/job/${jobId}`);
      return data;
    },
    enabled: Boolean(jobId),
  });
}

export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { job_id: number; resume_id: number; cover_letter?: string }) => {
      const { data } = await api.post<Application>("/applications", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ApplicationStatus }) => {
      const { data } = await api.patch<Application>(`/applications/${id}/status`, { status });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
