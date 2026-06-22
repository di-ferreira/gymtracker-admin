"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  Shuffle,
  Wrench,
  Bone,
  Move3d,
  Image,
  Package,
  LogOut,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Catálogo",
    items: [
      { href: "/exercises", label: "Exercícios", icon: Dumbbell },
      { href: "/alternatives", label: "Substituições", icon: Shuffle },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { href: "/equipment", label: "Equipamentos", icon: Wrench },
      { href: "/muscle-groups", label: "Grupos Musculares", icon: Bone },
      { href: "/movement-groups", label: "Grupos de Movimento", icon: Move3d },
    ],
  },
  {
    label: "Mídia",
    items: [
      { href: "/media", label: "Biblioteca", icon: Image },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/catalog-version", label: "Versão do Catálogo", icon: Package },
      { href: "/users", label: "Usuários", icon: Users },
    ],
  },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              GymTracker
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <Link
              href="/"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === "/"
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          {navItems.map((section) => (
            <div key={section.label}>
              <div className="px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {section.label}
                </span>
              </div>
              <div className="mt-1 space-y-0.5">
                {section.items?.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
