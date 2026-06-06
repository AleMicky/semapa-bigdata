'use client';

import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { LoadingState } from '@/components/ui/States';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return <LoadingState message="Verificando sesión..." />;
  return <>{children}</>;
}
