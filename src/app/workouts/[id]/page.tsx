"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useWorkout,
  useDeleteWorkout,
  useWorkoutExercises,
  useAddWorkoutExercise,
  useRemoveWorkoutExercise,
  useUpdateWorkoutExercise,
} from "@/hooks/use-workouts";
import { useExerciseList } from "@/hooks/use-exercises";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Dumbbell,
  GripVertical,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { WorkoutExerciseCreate, WorkoutExerciseUpdate } from "@/types";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useWorkout(id);
  const deleteWorkout = useDeleteWorkout();
  const { data: exercisesData } = useExerciseList({ per_page: 200 });
  const {
    data: workoutExercises,
    isLoading: exercisesLoading,
  } = useWorkoutExercises(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const workout = data?.data;

  const exerciseMap = new Map(exercisesData?.data.map((e) => [e.id, e.name]));

  async function handleDelete() {
    try {
      await deleteWorkout.mutateAsync(id);
      toast.success("Treino excluído com sucesso");
      router.push("/workouts");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir treino";
      toast.error(msg);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!workout) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Treino não encontrado</p>
          <Link href="/workouts">
            <Button variant="link" className="mt-2">
              Voltar para lista
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workouts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {workout.name}
              </h1>
              {workout.notes && (
                <p className="text-muted-foreground text-sm mt-1">
                  {workout.notes}
                </p>
              )}
            </div>
          </div>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger render={<Button variant="destructive" size="sm" />}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Treino</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir &quot;{workout.name}&quot;?
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteWorkout.isPending}
                >
                  {deleteWorkout.isPending ? "Excluindo..." : "Excluir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Exercícios ({workoutExercises?.length ?? 0})
              </CardTitle>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger render={<Button size="sm" />}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Exercício
                </DialogTrigger>
                <AddExerciseDialog
                  workoutId={id}
                  open={addOpen}
                  onOpenChange={setAddOpen}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {exercisesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !workoutExercises || workoutExercises.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum exercício neste treino
              </p>
            ) : (
              <div className="space-y-2">
                {workoutExercises
                  .slice()
                  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                  .map((we) => (
                    <div
                      key={we.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">
                          {(we.sort_order ?? 0) + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {exerciseMap.get(we.exercise_id) ?? we.exercise_id}
                        </p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                          {we.sets != null && <span>{we.sets} séries</span>}
                          {we.reps != null && <span>{we.reps} reps</span>}
                          {we.weight != null && <span>{we.weight} kg</span>}
                        </div>
                        {we.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {we.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingExercise(we.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <RemoveExerciseButton workoutId={id} exerciseId={we.id} />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {editingExercise && (
          <Dialog
            open={!!editingExercise}
            onOpenChange={(open) => { if (!open) setEditingExercise(null); }}
          >
            <EditExerciseDialog
              workoutId={id}
              workoutExerciseId={editingExercise}
              open={!!editingExercise}
              onOpenChange={(open) => { if (!open) setEditingExercise(null); }}
            />
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}

function AddExerciseDialog({
  workoutId,
  open,
  onOpenChange,
}: {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: exercises } = useExerciseList({ per_page: 200 });
  const addExercise = useAddWorkoutExercise();
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!exerciseId) return;
    try {
      const payload: WorkoutExerciseCreate = {
        exercise_id: exerciseId,
        sort_order: 0,
        sets: sets ? Number(sets) : undefined,
        reps: reps ? Number(reps) : undefined,
        weight: weight ? Number(weight) : undefined,
        notes: notes || undefined,
      };
      await addExercise.mutateAsync({ workoutId, data: payload });
      toast.success("Exercício adicionado");
      setExerciseId("");
      setSets("");
      setReps("");
      setWeight("");
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao adicionar exercício";
      toast.error(msg);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Exercício</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exercício</label>
          <Select value={exerciseId} onValueChange={(v) => v && setExerciseId(v)}>
            <SelectTrigger>
              <span>
                {exerciseId
                  ? exercises?.data.find((ex) => ex.id === exerciseId)?.name ?? exerciseId
                  : "Selecione..."}
              </span>
            </SelectTrigger>
            <SelectContent>
              {exercises?.data.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Séries</label>
            <Input type="number" min="0" value={sets} onChange={(e) => setSets(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reps</label>
            <Input type="number" min="0" value={reps} onChange={(e) => setReps(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Peso (kg)</label>
            <Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Observações</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={!exerciseId || addExercise.isPending}>
            {addExercise.isPending ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EditExerciseDialog({
  workoutId,
  workoutExerciseId,
  open,
  onOpenChange,
}: {
  workoutId: string;
  workoutExerciseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: weList } = useWorkoutExercises(workoutId);
  const updateExercise = useUpdateWorkoutExercise();
  const we = weList?.find((e) => e.id === workoutExerciseId);

  const [sets, setSets] = useState(String(we?.sets ?? ""));
  const [reps, setReps] = useState(String(we?.reps ?? ""));
  const [weight, setWeight] = useState(String(we?.weight ?? ""));
  const [notes, setNotes] = useState(we?.notes ?? "");

  useState(() => {
    if (we) {
      setSets(String(we.sets ?? ""));
      setReps(String(we.reps ?? ""));
      setWeight(String(we.weight ?? ""));
      setNotes(we.notes ?? "");
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: WorkoutExerciseUpdate = {
        sets: sets ? Number(sets) : undefined,
        reps: reps ? Number(reps) : undefined,
        weight: weight ? Number(weight) : undefined,
        notes: notes || undefined,
      };
      await updateExercise.mutateAsync({
        workoutId,
        exerciseId: workoutExerciseId,
        data: payload,
      });
      toast.success("Exercício atualizado");
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar exercício";
      toast.error(msg);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Exercício</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Séries</label>
            <Input type="number" min="0" value={sets} onChange={(e) => setSets(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reps</label>
            <Input type="number" min="0" value={reps} onChange={(e) => setReps(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Peso (kg)</label>
            <Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={updateExercise.isPending}>
            {updateExercise.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function RemoveExerciseButton({
  workoutId,
  exerciseId,
}: {
  workoutId: string;
  exerciseId: string;
}) {
  const removeExercise = useRemoveWorkoutExercise();

  async function handleRemove() {
    try {
      await removeExercise.mutateAsync({ workoutId, exerciseId });
      toast.success("Exercício removido");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao remover exercício";
      toast.error(msg);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-destructive"
      onClick={handleRemove}
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  );
}
