import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { JobListing, JobSearchFilters, Paginated } from "@/types";

export function useJobSearch(filters: JobSearchFilters) {
  return useQuery({
    queryKey: ["jobs", "search", filters],
    queryFn: async () => {
      const { data } = await api.get<Paginated<JobListing>>("/jobs/search", { params: filters });
      return data;
    },
  });
}

export function useJob(id: number | string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: async () => {
      const { data } = await api.get<JobListing>(`/jobs/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useMyJobs(employerId?: number) {
  return useQuery({
    queryKey: ["jobs", "mine", employerId],
    queryFn: async () => {
      const { data } = await api.get<Paginated<JobListing>>("/jobs/search", {
        params: { employer_id: employerId, page_size: 100 },
      });
      return data;
    },
    enabled: Boolean(employerId),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<JobListing>) => {
      const { data } = await api.post<JobListing>("/jobs", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<JobListing> }) => {
      const { data } = await api.patch<JobListing>(`/jobs/${id}`, payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/jobs/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
