'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen'>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className='flex flex-1 flex-col md:ml-3'>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className='flex-1 p-4 md:p-6'>{children}</main>
      </div>
    </div>
  );
}
