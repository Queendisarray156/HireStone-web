import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Candidate, Employer } from "@/types";

export function useEmployer(id?: number) {
  return useQuery({
    queryKey: ["employers", id],
    queryFn: async () => {
      const { data } = await api.get<Employer>(`/employers/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useMyEmployerProfile() {
  return useQuery({
    queryKey: ["employers", "me"],
    queryFn: async () => {
      const { data } = await api.get<Employer>("/employers/me");
      return data;
    },
  });
}

export function useMyCandidateProfile() {
  return useQuery({
    queryKey: ["candidates", "me"],
    queryFn: async () => {
      const { data } = await api.get<Candidate>("/candidates/me");
      return data;
    },
  });
}

export function useUpdateEmployerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Employer>) => {
      const { data } = await api.patch<Employer>("/employers/me", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employers", "me"] }),
  });
}

export function useUpdateCandidateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Candidate>) => {
      const { data } = await api.patch<Candidate>("/candidates/me", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["candidates", "me"] }),
  });
}
