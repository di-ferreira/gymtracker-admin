import { createService } from "./base";
import type {
  Equipment,
  EquipmentCreate,
  EquipmentUpdate,
} from "@/types";

const endpoint = "/admin/catalog/equipment";

export const equipmentService = createService<Equipment, EquipmentCreate, EquipmentUpdate>(endpoint);
