'use client';

import { clearAuth, getAuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState('');

  useEffect(() => {
    setUser(getAuthUser() ?? 'admin');
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">Plataforma de Gestión Inteligente</p>
          <p className="text-xs text-slate-500">Consumo de agua — IoT</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">{user}</p>
          <p className="text-xs text-slate-500">Operador SEMAPA</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Salir
        </button>
      </div>
    </header>
  );
}
