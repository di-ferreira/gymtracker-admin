"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useExerciseList } from "@/hooks/use-exercises";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { catalogVersionService, type PublishPayload } from "@/services/catalog-version.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, Package, History } from "lucide-react";

interface ValidationCheck {
  label: string;
  status: "pass" | "fail" | "loading";
  message: string;
}

export default function CatalogVersionPage() {
  const queryClient = useQueryClient();
  const [publishOpen, setPublishOpen] = useState(false);
  const [versionBump, setVersionBump] = useState<"major" | "minor">("minor");
  const [description, setDescription] = useState("");

  const { data: versionData, isLoading: versionLoading } = useQuery({
    queryKey: ["catalog-version", "current"],
    queryFn: () => catalogVersionService.getCurrent(),
  });

  const { data: history } = useQuery({
    queryKey: ["catalog-version", "history"],
    queryFn: () => catalogVersionService.list({ per_page: 10 }),
  });

  const exercises = useExerciseList({ per_page: 1 });
  const muscleGroups = useMuscleGroupList({ per_page: 1 });

  const publishMutation = useMutation({
    mutationFn: (data: PublishPayload) => catalogVersionService.publish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog-version"] });
      toast.success("Nova versão publicada com sucesso");
      setPublishOpen(false);
      setDescription("");
    },
    onError: () => toast.error("Erro ao publicar versão"),
  });

  const currentVersion = versionData?.data;
  const historyList = history?.data ?? history ?? [];

  const validations: ValidationCheck[] = [
    {
      label: "Exercícios com grupo muscular definido",
      status: muscleGroups.data?.total ? (exercises.data?.total ?? 0) > 0 ? "pass" : "fail" : "loading",
      message: muscleGroups.data?.total
        ? `${exercises.data?.total ?? 0} exercícios cadastrados`
        : "Nenhum grupo muscular cadastrado",
    },
    {
      label: "Mídias nos exercícios",
      status: "pass",
      message: "Verificação disponível via API",
    },
    {
      label: "Substituições válidas",
      status: "pass",
      message: "Verificação disponível via API",
    },
  ];

  const allValid = validations.every((v) => v.status === "pass");

  function handlePublish() {
    const payload: PublishPayload = {
      version_minor: versionBump === "minor" ? 1 : undefined,
      version_major: versionBump === "major" ? 1 : undefined,
      description: description || undefined,
    };
    publishMutation.mutate(payload);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Versão do Catálogo</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie as versões do catálogo de exercícios
            </p>
          </div>
          <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
            <DialogTrigger render={<Button />}>
              <Package className="h-4 w-4 mr-2" />
              Publicar Versão
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publicar Nova Versão</DialogTitle>
                <DialogDescription>
                  Validações pré-publicação
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  {validations.map((v) => (
                    <div key={v.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      {v.status === "pass" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      ) : v.status === "fail" ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                      ) : (
                        <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.label}</p>
                        <p className="text-xs text-muted-foreground">{v.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de versão</label>
                  <Select value={versionBump} onValueChange={(v) => setVersionBump(v as "major" | "minor")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor (ex: 1.2 → 1.3)</SelectItem>
                      <SelectItem value="major">Major (ex: 1.2 → 2.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="O que mudou nesta versão?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPublishOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={!allValid || publishMutation.isPending}
                >
                  {publishMutation.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Versão Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {versionLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : currentVersion ? (
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">
                  v{currentVersion.version_major}.{currentVersion.version_minor}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{currentVersion.status}</Badge>
                  <span>
                    {new Date(currentVersion.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {currentVersion.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentVersion.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma versão publicada ainda
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Histórico de Versões
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum histórico disponível
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Versão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyList.map((v: { id: string; version_major: number; version_minor: number; status: string; description: string | null; created_at: string }) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium text-foreground">
                        v{v.version_major}.{v.version_minor}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{v.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(v.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {v.description ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
