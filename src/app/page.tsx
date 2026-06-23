"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useExerciseList } from "@/hooks/use-exercises";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useEquipmentList } from "@/hooks/use-equipment";
import { apiGet } from "@/actions/api.action";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Bone, Wrench, Shuffle } from "lucide-react";
import Link from "next/link";

function MetricCard({
  label,
  icon: Icon,
  href,
  total,
  isLoading,
  color,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  total: number | undefined;
  isLoading: boolean;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2 text-foreground">
              {total ?? "—"}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  const exerciseQuery = useExerciseList({ per_page: 1 });
  const muscleQuery = useMuscleGroupList({ per_page: 1 });
  const equipmentQuery = useEquipmentList({ per_page: 1 });
  const { data: firstExercise } = useExerciseList({ per_page: 1 });
  const firstExerciseId = firstExercise?.data?.[0]?.id;
  const substitutionQuery = useQuery({
    queryKey: ["substitutions", "count", firstExerciseId],
    queryFn: () => apiGet<any[]>(`/admin/catalog/exercises/${firstExerciseId!}/alternatives/`),
    enabled: !!firstExerciseId,
  });

  const allLoading = exerciseQuery.isLoading || muscleQuery.isLoading || equipmentQuery.isLoading || substitutionQuery.isLoading || !firstExerciseId;
  const isEmpty = !allLoading && (
    (exerciseQuery.data?.total ?? 0) === 0 &&
    (muscleQuery.data?.total ?? 0) === 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visão geral do catálogo de exercícios
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total de Exercícios"
            icon={Dumbbell}
            href="/exercises"
            total={exerciseQuery.data?.total}
            isLoading={exerciseQuery.isLoading}
            color="text-primary"
          />
          <MetricCard
            label="Grupos Musculares"
            icon={Bone}
            href="/muscle-groups"
            total={muscleQuery.data?.total}
            isLoading={muscleQuery.isLoading}
            color="text-green-500"
          />
          <MetricCard
            label="Equipamentos"
            icon={Wrench}
            href="/equipment"
            total={equipmentQuery.data?.total}
            isLoading={equipmentQuery.isLoading}
            color="text-blue-500"
          />
          <MetricCard
            label="Substituições"
            icon={Shuffle}
            href="/alternatives"
            total={substitutionQuery.data?.length ?? 0}
            isLoading={substitutionQuery.isLoading}
            color="text-yellow-500"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {allLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : isEmpty ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  Nenhum dado encontrado. Conecte-se à API para visualizar as informações do catálogo.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  Catálogo com dados prontos para gerenciamento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
