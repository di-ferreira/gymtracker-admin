import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from "@/actions/api.action";
import type { ExerciseInstruction, InstructionCreate, InstructionUpdate } from "@/types";

export function useInstructionList(exerciseId: string | undefined) {
  return useQuery({
    queryKey: ["instructions", exerciseId],
    queryFn: () =>
      apiGet<ExerciseInstruction[]>(`/admin/catalog/exercises/${exerciseId}/instructions/`),
    enabled: !!exerciseId,
  });
}

export function useCreateInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, data }: { exerciseId: string; data: InstructionCreate }) =>
      apiPost<ExerciseInstruction>(`/admin/catalog/exercises/${exerciseId}/instructions/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}

export function useUpdateInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, instructionId, data }: { exerciseId: string; instructionId: string; data: InstructionUpdate }) =>
      apiPatch<ExerciseInstruction>(`/admin/catalog/exercises/${exerciseId}/instructions/${instructionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}

export function useDeleteInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, instructionId }: { exerciseId: string; instructionId: string }) =>
      apiDelete(`/admin/catalog/exercises/${exerciseId}/instructions/${instructionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}
