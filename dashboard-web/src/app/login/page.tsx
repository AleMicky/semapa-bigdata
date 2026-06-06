'use client';

import { MOCK_CREDENTIALS, saveMockAuth } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    saveMockAuth(data.usuario);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0c4a8a] via-[#0369a1] to-[#0ea5e9] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#0c4a8a]">SEMAPA</h1>
          <p className="mt-1 text-sm text-slate-500">Smart City — Gestión de Agua</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
            <input
              {...register('usuario')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="admin"
              autoComplete="username"
            />
            {errors.usuario && <p className="mt-1 text-xs text-red-600">{errors.usuario.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              {...register('contrasena')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.contrasena && <p className="mt-1 text-xs text-red-600">{errors.contrasena.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#0c4a8a] py-2.5 text-sm font-semibold text-white hover:bg-[#0a3d72] disabled:opacity-60"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">
          Demo: usuario <strong>{MOCK_CREDENTIALS.usuario}</strong> / contraseña{' '}
          <strong>{MOCK_CREDENTIALS.contrasena}</strong>
          <br />
          (cualquier credencial válida en esta fase)
        </p>
      </div>
    </div>
  );
}
