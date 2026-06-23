export const initialExercises = [
  {
    id: "e1",
    name: "Supino Reto",
    description: "Exercício clássico para peitoral",
    execution_tips: "Mantenha os cotovelos a 45 graus",
    difficulty: "Intermediate",
    movement_group_id: "mg1",
    muscle_group_id: "m1",
    equipment_ids: ["eq1"],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "e2",
    name: "Rosca Direta",
    description: "Exercício para bíceps",
    execution_tips: "Não balançar o corpo",
    difficulty: "Beginner",
    movement_group_id: "mg2",
    muscle_group_id: "m2",
    equipment_ids: ["eq2"],
    thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z",
  },
];

export const initialEquipment = [
  { id: "eq1", name: "Barra Reta", description: null, category: "Barras", order_index: 1, created_at: "", updated_at: "" },
  { id: "eq2", name: "Halteres", description: null, category: "Pesos", order_index: 2, created_at: "", updated_at: "" },
];

export const initialMuscleGroups = [
  { id: "m1", name: "Peitoral", description: "Músculos do peito", order_index: 1, created_at: "", updated_at: "" },
  { id: "m2", name: "Bíceps", description: "Músculos do braço", order_index: 2, created_at: "", updated_at: "" },
];

export const initialMovementGroups = [
  { id: "mg1", name: "Empurrar", description: "Movimentos de empurrar", order_index: 1, created_at: "", updated_at: "" },
  { id: "mg2", name: "Puxar", description: "Movimentos de puxar", order_index: 2, created_at: "", updated_at: "" },
];

export const initialSubstitutions = [
  { id: "s1", exercise_id: "e1", alternative_exercise_id: "e2", reason: "Mesmo grupo muscular", note: null, created_at: "", updated_at: "" },
];

export const initialUsers = [
  { id: "u1", email: "admin@gymtracker.com", name: "Admin", role: "admin", is_active: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "user@gymtracker.com", name: "João Usuário", role: "user", is_active: true, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z" },
  { id: "u3", email: "inactive@gymtracker.com", name: "Inativo", role: "user", is_active: false, created_at: "2025-01-03T00:00:00Z", updated_at: "2025-01-03T00:00:00Z" },
];
