'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/mapa', label: 'Mapa de Consumo', icon: '🗺️' },
  { href: '/dashboard/contratos', label: 'Contratos', icon: '📋' },
  { href: '/dashboard/medidores', label: 'Medidores', icon: '📡' },
  { href: '/dashboard/lecturas', label: 'Lecturas', icon: '💧' },
  { href: '/dashboard/reportes', label: 'Reportes', icon: '📈' },
  { href: '/dashboard/preavisos', label: 'Preavisos', icon: '📄' },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: '⚙️' },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0c4a8a] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-lg font-bold tracking-tight">SEMAPA</p>
          <p className="text-xs text-sky-200">Smart City — BigData</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? 'bg-white/15 font-medium text-white' : 'text-sky-100 hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-sky-200">
          Demo Fase 2 — Cochabamba
        </div>
      </aside>
    </>
  );
}
