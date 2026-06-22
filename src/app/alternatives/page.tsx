"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useExerciseList } from "@/hooks/use-exercises";
import { substitutionService, type Substitution, type SubstitutionCreate } from "@/services/substitution.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search } from "lucide-react";

export default function AlternativesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: exercises } = useExerciseList({ search, per_page: 100 });
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: alternatives, isLoading } = useQuery({
    queryKey: ["substitutions", selectedExercise],
    queryFn: () => substitutionService.list({ exercise_id: selectedExercise ?? undefined }),
    enabled: !!selectedExercise,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => substitutionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substitutions"] });
      toast.success("Substituição removida");
    },
  });

  const alternativesList: Substitution[] = alternatives?.data ?? alternatives ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Substituições</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie exercícios substitutos (relação n:n)
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Exercícios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {exercises?.data.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExercise(ex.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedExercise === ex.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {ex.name}
                  </button>
                ))}
                {exercises?.data.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum exercício encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {selectedExercise
                    ? `Substitutos para ${exercises?.data.find((e) => e.id === selectedExercise)?.name ?? ""}`
                    : "Selecione um exercício"}
                </CardTitle>
                {selectedExercise && (
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger render={<Button size="sm" />}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </DialogTrigger>
                    <CreateSubstitutionDialog
                      exerciseId={selectedExercise}
                      onSuccess={() => setCreateOpen(false)}
                    />
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedExercise ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Selecione um exercício ao lado para gerenciar suas substituições
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : alternativesList.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Nenhum substituto configurado para este exercício
                </div>
              ) : (
                <div className="space-y-2">
                  {alternativesList.map((alt) => {
                    const altExercise = exercises?.data.find(
                      (e) => e.id === alt.alternative_exercise_id,
                    );
                    return (
                      <div
                        key={alt.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="shrink-0">
                            Substituto
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {altExercise?.name ?? alt.alternative_exercise_id}
                            </p>
                            {alt.reason && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {alt.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteMutation.mutate(alt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CreateSubstitutionDialog({
  exerciseId,
  onSuccess,
}: {
  exerciseId: string;
  onSuccess: () => void;
}) {
  const { data: exercises } = useExerciseList({ per_page: 200 });
  const queryClient = useQueryClient();
  const [alternativeId, setAlternativeId] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: SubstitutionCreate) => substitutionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substitutions"] });
      toast.success("Substituição adicionada");
      setAlternativeId("");
      setReason("");
      setNote("");
      onSuccess();
    },
  });

  const availableExercises = exercises?.data.filter((e) => e.id !== exerciseId) ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alternativeId) return;
    createMutation.mutate({
      exercise_id: exerciseId,
      alternative_exercise_id: alternativeId,
      reason: reason || null,
      note: note || null,
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Substituto</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exercício Substituto</label>
          <Select value={alternativeId} onValueChange={(v) => v && setAlternativeId(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {availableExercises.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Motivo (opcional)</label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Mesmo grupo muscular"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Observação (opcional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Preferir este quando houver lesão no ombro"
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={!alternativeId || createMutation.isPending}>
            {createMutation.isPending ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
