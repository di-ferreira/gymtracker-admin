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
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroupCreate {
  name: string;
  description?: string;
  order_index?: number;
}

export interface MuscleGroupUpdate {
  name?: string;
  description?: string;
  order_index?: number;
}

export interface MovementGroup {
  id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MovementGroupCreate {
  name: string;
  description?: string;
  order_index?: number;
}

export interface MovementGroupUpdate {
  name?: string;
  description?: string;
  order_index?: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EquipmentCreate {
  name: string;
  description?: string;
  category?: string;
  order_index?: number;
}

export interface EquipmentUpdate {
  name?: string;
  description?: string;
  category?: string;
  order_index?: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  execution_tips: string | null;
  difficulty: DifficultyLevel | null;
  thumbnail_url: string | null;
  image_url: string | null;
  gif_url: string | null;
  video_url: string | null;
  movement_group_id: string;
  muscle_group_id: string;
  equipment_ids?: string[];
  instructions?: ExerciseInstruction[];
  created_at: string;
  updated_at: string;
}

export interface ExerciseCreate {
  name: string;
  description?: string;
  execution_tips?: string;
  difficulty?: DifficultyLevel;
  thumbnail_url?: string;
  image_url?: string;
  gif_url?: string;
  video_url?: string;
  movement_group_id: string;
  muscle_group_id: string;
  equipment_ids?: string[];
}

export interface ExerciseUpdate {
  name?: string;
  description?: string;
  execution_tips?: string;
  difficulty?: DifficultyLevel;
  thumbnail_url?: string;
  image_url?: string;
  gif_url?: string;
  video_url?: string;
  movement_group_id?: string;
  muscle_group_id?: string;
  equipment_ids?: string[] | null;
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

export interface InstructionCreate {
  description: string;
  step_order?: number;
  image_url?: string;
}

export interface InstructionUpdate {
  description?: string;
  step_order?: number;
  image_url?: string;
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

export interface Workout {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  user?: User;
  exercises?: WorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutCreate {
  name: string;
  description?: string;
  user_id: string;
}

export interface WorkoutUpdate {
  name?: string;
  description?: string;
  user_id?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise?: Exercise;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  rest_seconds: number | null;
  notes: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExerciseCreate {
  exercise_id: string;
  sets?: number;
  reps?: number;
  weight?: number;
  rest_seconds?: number;
  notes?: string;
  order?: number;
}

export interface WorkoutExerciseUpdate {
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  order?: number;
}

export interface WorkoutReorder {
  exercise_ids: string[];
}
