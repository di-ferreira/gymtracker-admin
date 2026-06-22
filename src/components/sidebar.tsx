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
} from "lucide-react";

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
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="text-lg font-bold tracking-tight text-foreground">
          GymTracker
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 py-1">
            <Link
              href="/"
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

      <div className="border-t border-border px-6 py-4">
        <span className="text-xs text-muted-foreground">
          GymTracker Admin v0.1
        </span>
      </div>
    </aside>
  );
}
