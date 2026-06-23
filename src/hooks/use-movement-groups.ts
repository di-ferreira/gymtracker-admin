import { createCrudHooks } from "@/hooks/use-crud";
import type { MovementGroup, MovementGroupCreate, MovementGroupUpdate } from "@/types";

export const {
  useList: useMovementGroupList,
  useGet: useMovementGroup,
  useCreate: useCreateMovementGroup,
  useUpdate: useUpdateMovementGroup,
  useRemove: useDeleteMovementGroup,
} = createCrudHooks<MovementGroup, MovementGroupCreate, MovementGroupUpdate>(
  "/admin/catalog/movement-groups",
  "movement-groups",
);
