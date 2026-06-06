'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
