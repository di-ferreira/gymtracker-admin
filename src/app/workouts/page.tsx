"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useWorkoutList } from "@/hooks/use-workouts";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Calendar } from "lucide-react";

export default function WorkoutListPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useWorkoutList({ search, per_page: 20 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Treinos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie os treinos dos usuários
            </p>
          </div>
          <Link href="/workouts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Treino
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar treinos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-60" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                    Nenhum treino encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">
                      <Link href={`/workouts/${workout.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {workout.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {workout.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/workouts/${workout.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
