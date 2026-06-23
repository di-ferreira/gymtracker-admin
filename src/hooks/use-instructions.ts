import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { instructionService } from "@/services/instruction.service";
import type { InstructionCreate, InstructionUpdate } from "@/types";

export function useInstructionList(exerciseId: string | undefined) {
  return useQuery({
    queryKey: ["instructions", exerciseId],
    queryFn: () => instructionService.list(exerciseId!),
    enabled: !!exerciseId,
  });
}

export function useCreateInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, data }: { exerciseId: string; data: InstructionCreate }) =>
      instructionService.create(exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}

export function useUpdateInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, instructionId, data }: { exerciseId: string; instructionId: string; data: InstructionUpdate }) =>
      instructionService.update(exerciseId, instructionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}

export function useDeleteInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, instructionId }: { exerciseId: string; instructionId: string }) =>
      instructionService.remove(exerciseId, instructionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructions"] });
    },
  });
}
