export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type MediaUrlType = "THUMBNAIL" | "IMAGE" | "GIF" | "VIDEO";
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UpdateProfileRequest {
  name?: string;
  current_password?: string;
  new_password?: string;
}

export interface AdminUpdateUserRequest {
  name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface MuscleGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroupCreate {
  name: string;
  slug?: string;
  description?: string;
  order_index?: number;
}

export interface MuscleGroupUpdate {
  name?: string;
  slug?: string;
  description?: string;
  order_index?: number;
}

export interface MovementGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MovementGroupCreate {
  name: string;
  slug?: string;
  description?: string;
  order_index?: number;
}

export interface MovementGroupUpdate {
  name?: string;
  slug?: string;
  description?: string;
  order_index?: number;
}

export interface Equipment {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  order_index: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentCreate {
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  order_index?: number;
}

export interface EquipmentUpdate {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  order_index?: number;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  execution_tips: string | null;
  difficulty: DifficultyLevel | null;
  target_muscle_primary?: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
  gif_url: string | null;
  video_url: string | null;
  movement_group_id: string;
  muscle_group_id: string;
  movement_group?: MovementGroup;
  muscle_group?: MuscleGroup;
  equipment_relations?: ExerciseEquipment[];
  instructions?: ExerciseInstruction[];
  alternatives?: ExerciseAlternative[];
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseCreate {
  name: string;
  slug?: string;
  description?: string;
  execution_tips?: string;
  difficulty?: DifficultyLevel;
  target_muscle_primary?: string;
  thumbnail_url?: string;
  image_url?: string;
  gif_url?: string;
  video_url?: string;
  movement_group_id: string;
  muscle_group_id: string;
}

export interface ExerciseUpdate {
  name?: string;
  slug?: string;
  description?: string;
  execution_tips?: string;
  difficulty?: DifficultyLevel;
  target_muscle_primary?: string;
  thumbnail_url?: string;
  image_url?: string;
  gif_url?: string;
  video_url?: string;
  movement_group_id?: string;
  muscle_group_id?: string;
}

export interface ExerciseEquipment {
  exercise_id: string;
  equipment_id: string;
  usage_note: string | null;
}

export interface ExerciseInstruction {
  id: string;
  exercise_id: string;
  step_order: number;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseAlternative {
  id: string;
  exercise_id: string;
  alternative_exercise_id: string;
  reason: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CatalogVersion {
  id: string;
  version_major: number;
  version_minor: number;
  checksum: string;
  status: string;
  description: string | null;
  checksum_algorithm: string;
  sync_metadata: string | null;
  created_at: string;
  updated_at: string;
}
