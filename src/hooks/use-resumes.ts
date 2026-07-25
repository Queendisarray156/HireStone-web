import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Resume } from "@/types";

export function useMyResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const { data } = await api.get<Resume[]>("/resumes");
      return data;
    },
  });
}

export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<Resume>("/resumes", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
  });
}

export function useSetPrimaryResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<Resume>(`/resumes/${id}/primary`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
  });
}

export function useDeleteResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/resumes/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
  });
}
