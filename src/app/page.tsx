import { DashboardLayout } from "@/components/dashboard-layout";

export default function Home() {
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
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total de Exercícios</p>
            <p className="text-3xl font-bold mt-1 text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Grupos Musculares</p>
            <p className="text-3xl font-bold mt-1 text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Equipamentos</p>
            <p className="text-3xl font-bold mt-1 text-foreground">—</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Substituições</p>
            <p className="text-3xl font-bold mt-1 text-foreground">—</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-muted-foreground text-sm">
              Conecte-se à API para visualizar os dados do catálogo.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
