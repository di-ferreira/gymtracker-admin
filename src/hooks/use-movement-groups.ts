import { createCrudHooks } from "@/hooks/use-crud";
import { movementGroupService } from "@/services/movement-group.service";
import type { MovementGroup, MovementGroupCreate, MovementGroupUpdate } from "@/types";

export const {
  useList: useMovementGroupList,
  useGet: useMovementGroup,
  useCreate: useCreateMovementGroup,
  useUpdate: useUpdateMovementGroup,
  useRemove: useDeleteMovementGroup,
} = createCrudHooks<MovementGroup, MovementGroupCreate, MovementGroupUpdate>(
  movementGroupService,
  "movement-groups",
);
