import { NextRequest, NextResponse } from "next/server";

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

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

const initialExercises = [
  {
    id: "e1", name: "Supino Reto", slug: "supino-reto",
    description: "Exercício clássico para peitoral", execution_tips: "Mantenha os cotovelos a 45 graus",
    difficulty: "Intermediate", thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    movement_group_id: "mg1", muscle_group_id: "m1",
    muscle_group: mockMuscleGroups[0], movement_group: mockMovementGroups[0],
    equipment: [mockEquipment[0]], equipment_ids: ["eq1"],
    instructions: [], created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "e2", name: "Rosca Direta", slug: "rosca-direta",
    description: "Exercício para bíceps", execution_tips: "Não balançar o corpo",
    difficulty: "Beginner", thumbnail_url: null, image_url: null, gif_url: null, video_url: null,
    movement_group_id: "mg2", muscle_group_id: "m2",
    muscle_group: mockMuscleGroups[1], movement_group: mockMovementGroups[1],
    equipment: [mockEquipment[1]], equipment_ids: ["eq2"],
    instructions: [], created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z",
  },
];

const initialSubstitutions = [
  { id: "s1", exercise_id: "e1", alternative_exercise_id: "e2", reason: "Mesmo grupo muscular", note: null, created_at: "", updated_at: "" },
];

const initialUsers = [
  { id: "u1", email: "admin@gymtracker.com", name: "Admin", role: "admin", is_active: true, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "user@gymtracker.com", name: "João Usuário", role: "user", is_active: true, created_at: "2025-01-02T00:00:00Z", updated_at: "2025-01-02T00:00:00Z" },
  { id: "u3", email: "inactive@gymtracker.com", name: "Inativo", role: "user", is_active: false, created_at: "2025-01-03T00:00:00Z", updated_at: "2025-01-03T00:00:00Z" },
];

const config = { delay: 0, emptyMode: false };

const state = clone({ exercises: initialExercises, equipment: mockEquipment, muscleGroups: mockMuscleGroups, movementGroups: mockMovementGroups, substitutions: initialSubstitutions, users: initialUsers });

let idCounter = 100;
const nextId = () => `mock-${++idCounter}`;
const maybeDelay = () => config.delay > 0 ? new Promise((r) => setTimeout(r, config.delay)) : Promise.resolve();
const json = (data: unknown, status = 200) => new NextResponse(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const colMap: Record<string, unknown[]> = {
  exercises: state.exercises, equipment: state.equipment,
  "muscle-groups": state.muscleGroups, "movement-groups": state.movementGroups,
  users: state.users,
};

function applySearch(items: Record<string, unknown>[], search?: string | null) {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((i) => String(i.name ?? "").toLowerCase().includes(q));
}

async function handleCrud(req: NextRequest, resource: string, id: string | undefined) {
  await maybeDelay();
  const col = colMap[resource];
  if (!col) return json({ error: "unknown" }, 404);
  if (config.emptyMode && !id) return json([]);
  if (req.method === "GET") {
    if (id) {
      const item = col.find((i) => (i as Record<string, unknown>).id === id);
      return item ? json(item) : json({ error: "not found" }, 404);
    }
    const url = new URL(req.url);
    return json(applySearch(col as Record<string, unknown>[], url.searchParams.get("search")));
  }
  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    const created = { id: nextId(), ...body };
    col.push(created);
    return json(created, 201);
  }
  if (req.method === "PATCH" || req.method === "PUT") {
    const idx = col.findIndex((i) => (i as Record<string, unknown>).id === id);
    if (idx === -1) return json({ error: "not found" }, 404);
    const body = await req.json().catch(() => ({}));
    col[idx] = { ...(col[idx] as Record<string, unknown>), ...body } as never;
    return json(col[idx]);
  }
  if (req.method === "DELETE") {
    const idx = col.findIndex((i) => (i as Record<string, unknown>).id === id);
    if (idx !== -1) col.splice(idx, 1);
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
}

async function route(req: NextRequest, path: string[]): Promise<NextResponse> {
  const p = path.join("/");

  if (p === "__reset") {
    Object.assign(state, clone({ exercises: initialExercises, equipment: mockEquipment, muscleGroups: mockMuscleGroups, movementGroups: mockMovementGroups, substitutions: initialSubstitutions, users: initialUsers }));
    config.delay = 0; config.emptyMode = false; idCounter = 100;
    return json({ ok: true });
  }
  if (p === "__config") {
    if (req.method === "POST" || req.method === "PUT") {
      const body = await req.json().catch(() => ({}));
      if (typeof body.delay === "number") config.delay = body.delay;
      if (typeof body.emptyMode === "boolean") config.emptyMode = body.emptyMode;
    }
    if (req.method === "GET") {
      const url = new URL(req.url);
      const d = url.searchParams.get("delay");
      const e = url.searchParams.get("emptyMode");
      if (d !== null) config.delay = Number(d);
      if (e !== null) config.emptyMode = e === "true";
    }
    return json({ ok: true });
  }
  if (p === "auth/me") { await maybeDelay(); return json(state.users[0]); }
  if (p === "auth/login") return json({ access_token: "fake-test-token" });
  if (p === "admin/media/upload") return json({ url: "https://example.com/uploads/test.gif", path: "exercises/test.gif", filename: "test.gif" });
  if (p === "admin/workouts" || (p.startsWith("admin/workouts/"))) {
    return json([]); // workouts not used in tests
  }

  if (path[0] === "admin" && path[1] === "catalog") {
    const resource = path[2];
    if (resource === "exercises" && path[3] && path[4] === "alternatives") {
      const exerciseId = path[3], altId = path[5];
      await maybeDelay();
      if (req.method === "GET") return json(state.substitutions.filter((s) => s.exercise_id === exerciseId));
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        const created = { id: nextId(), exercise_id: exerciseId, ...body };
        state.substitutions.push(created);
        return json(created, 201);
      }
      if (req.method === "DELETE" && altId) {
        const idx = state.substitutions.findIndex((s) => s.id === altId);
        if (idx !== -1) state.substitutions.splice(idx, 1);
        return json({ ok: true });
      }
      return json({ error: "method not allowed" }, 405);
    }
    if (resource === "exercises" && !path[3] && req.method === "GET") {
      if (config.emptyMode) return json({ data: [], pagination: { page: 1, per_page: 0, total_pages: 0, has_previous: false, has_next: false, total_items: 0 } });
      await maybeDelay();
      const url = new URL(req.url);
      const items = applySearch(state.exercises as Record<string, unknown>[], url.searchParams.get("search"));
      return json({
        data: items,
        pagination: {
          page: 1,
          per_page: items.length,
          total_pages: 1,
          has_previous: false,
          has_next: false,
          total_items: items.length,
        },
      });
    }
    return handleCrud(req, resource, path[3]);
  }
  if (path[0] === "admin" && path[1] === "users") return handleCrud(req, "users", path[2]);
  return json({ error: "not found" }, 404);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { const { path } = await params; return route(req, path); }
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { const { path } = await params; return route(req, path); }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { const { path } = await params; return route(req, path); }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { const { path } = await params; return route(req, path); }
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { const { path } = await params; return route(req, path); }
