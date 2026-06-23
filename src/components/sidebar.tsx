'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  Activity,
  ArrowLeftRight,
  Calendar,
  Dumbbell,
  Heart,
  LayoutDashboard,
  Shirt,
  Users,
  Weight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Usuários', icon: Users },
  { href: '/workouts', label: 'Treinos', icon: Calendar },
  { href: '/exercises', label: 'Exercícios', icon: Dumbbell },
  { href: '/equipment', label: 'Equipamentos', icon: Weight },
  { href: '/muscle-groups', label: 'Grupos Musculares', icon: Shirt },
  { href: '/movement-groups', label: 'Grupos de Movimento', icon: Heart },
  { href: '/alternatives', label: 'Alternativas', icon: ArrowLeftRight },
  { href: '/substitutions', label: 'Substituições', icon: Activity },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <nav className='flex flex-col h-full'>
      <div className='flex items-center gap-3 px-6 py-5 border-b border-border'>
        <div className='relative w-8 h-8'>
          <Image
            src='/next.svg'
            alt='GymTracker'
            width={32}
            height={32}
            className='dark:invert'
          />
        </div>
        <div>
          <h2 className='text-sm font-semibold leading-tight'>GymTracker</h2>
          <p className='text-xs text-muted-foreground'>Admin Panel</p>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto p-3 space-y-1'>
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              <Icon className='h-4 w-4 shrink-0' />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <aside className='hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-card'>
        {content}
      </aside>
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <SheetContent side='left' className='w-64 p-0'>
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}

