const mockMuscleGroups = [
  { id: "m1", name: "Peitoral", slug: "peitoral", description: "Músculos do peito", order_index: 1, created_at: "", updated_at: "" },
  { id: "m2", name: "Bíceps", slug: "biceps", description: "Músculos do braço", order_index: 2, created_at: "", updated_at: "" },
];

const mockMovementGroups = [
  { id: "mg1", name: "Empurrar", slug: "empurrar", description: "Movimentos de empurrar", order_index: 1, created_at: "", updated_at: "" },
  { id: "mg2", name: "Puxar", slug: "puxar", description: "Movimentos de puxar", order_index: 2, created_at: "", updated_at: "" },
];

const mockEquipment = [
  { id: "eq1", name: "Barra Reta", slug: "barra-reta", description: null, category: "Barras", order_index: 1, deleted_at: null, created_at: "", updated_at: "" },
  { id: "eq2", name: "Halteres", slug: "halteres", description: null, category: "Pesos", order_index: 2, deleted_at: null, created_at: "", updated_at: "" },
];

export const initialExercises = [
  {
    id: "e1", name: "Supino Reto", slug: "supino-reto",
    description: "Exercício clássico para peitoral", execution_tips: "Mantenha os cotovelos a 45 graus",
    difficulty: "Intermediate", thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    movement_group_id: "mg1", muscle_group_id: "m1",
    muscle_group: mockMuscleGroups[0], movement_group: mockMovementGroups[0],
    equipment: [mockEquipment[0]], equipment_ids: ["eq1"],
    created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "e2", name: "Rosca Direta", slug: "rosca-direta",
    description: "Exercício para bíceps", execution_tips: "Não balançar o corpo",
    difficulty: "Beginner", thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    movement_group_id: "mg2", muscle_group_id: "m2",
    muscle_group: mockMuscleGroups[1], movement_group: mockMovementGroups[1],
    equipment: [mockEquipment[1]], equipment_ids: ["eq2"],
    created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z",
  },
];

export const initialEquipment = mockEquipment;
export const initialMuscleGroups = mockMuscleGroups;
export const initialMovementGroups = mockMovementGroups;

export const initialSubstitutions = [
  { id: "s1", exercise_id: "e1", alternative_exercise_id: "e2", reason: "Mesmo grupo muscular", note: null, created_at: "", updated_at: "" },
];

export const initialUsers = [
  { id: "u1", email: "admin@gymtracker.com", name: "Admin", role: "admin", is_active: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "user@gymtracker.com", name: "João Usuário", role: "user", is_active: true, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z" },
  { id: "u3", email: "inactive@gymtracker.com", name: "Inativo", role: "user", is_active: false, created_at: "2025-01-03T00:00:00Z", updated_at: "2025-01-03T00:00:00Z" },
];
