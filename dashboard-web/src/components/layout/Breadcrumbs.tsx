'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  mapa: 'Mapa de Consumo',
  contratos: 'Contratos',
  medidores: 'Medidores',
  lecturas: 'Lecturas',
  preavisos: 'Preavisos',
  reportes: 'Reportes',
  configuracion: 'Configuración',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    return { href, label: labels[seg] ?? seg };
  });

  return (
    <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300">/</span>}
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-slate-800">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-sky-600">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
