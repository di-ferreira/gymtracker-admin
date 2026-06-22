import { createService } from "./base";
import type {
  MovementGroup,
  MovementGroupCreate,
  MovementGroupUpdate,
} from "@/types";

const endpoint = "/admin/catalog/movement-groups";

export const movementGroupService = createService<MovementGroup, MovementGroupCreate, MovementGroupUpdate>(endpoint);
