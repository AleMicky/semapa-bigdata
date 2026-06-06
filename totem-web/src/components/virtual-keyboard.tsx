'use client';

import type { ConsultaTipo } from '@/types/totem';

interface VirtualKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  tipo: ConsultaTipo;
}

const NUMERIC_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const MEDIDOR_EXTRA_KEYS = ['M', 'E', 'D', '-'];

export function VirtualKeyboard({ value, onChange, tipo }: VirtualKeyboardProps) {
  const extraKeys = tipo === 'medidor' ? MEDIDOR_EXTRA_KEYS : [];

  function appendKey(key: string) {
    onChange(value + key);
  }

  function backspace() {
    onChange(value.slice(0, -1));
  }

  function clearAll() {
    onChange('');
  }

  return (
    <div className="w-full max-w-3xl rounded-3xl border-4 border-semapa-sky/30 bg-white p-6 shadow-inner">
      {extraKeys.length > 0 && (
        <div className="mb-4 grid grid-cols-4 gap-3">
          {extraKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => appendKey(key)}
              className="kiosk-key bg-sky-50 text-semapa-blue"
            >
              {key}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {NUMERIC_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => appendKey(key)}
            className="kiosk-key"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button type="button" onClick={backspace} className="kiosk-key bg-amber-100 text-amber-900">
          Borrar
        </button>
        <button type="button" onClick={clearAll} className="kiosk-key bg-red-100 text-red-800">
          Limpiar
        </button>
      </div>
    </div>
  );
}
