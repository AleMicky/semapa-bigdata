'use client';

import type { MapaPuntoConsumo } from '@/types/dashboard';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';

export const COCHABAMBA_CENTER: [number, number] = [-17.3895, -66.1568];

const ESTADO_COLORS: Record<MapaPuntoConsumo['estado'], string> = {
  NORMAL: '#10b981',
  ALTO: '#f59e0b',
  SOBRECONSUMO: '#ef4444',
  SIN_SENAL: '#94a3b8',
};

const ESTADO_LABELS: Record<MapaPuntoConsumo['estado'], string> = {
  NORMAL: 'Consumo normal',
  ALTO: 'Consumo alto',
  SOBRECONSUMO: 'Sobreconsumo',
  SIN_SENAL: 'Sin señal',
};

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function MapController({
  focusPoint,
  puntos,
}: {
  focusPoint: MapaPuntoConsumo | null;
  puntos: MapaPuntoConsumo[];
}) {
  const map = useMap();

  useEffect(() => {
    if (focusPoint) {
      map.flyTo([focusPoint.latitud, focusPoint.longitud], 15, { duration: 1 });
      return;
    }
    if (puntos.length > 0) {
      const bounds = L.latLngBounds(puntos.map((p) => [p.latitud, p.longitud]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [focusPoint, puntos, map]);

  return null;
}

interface ConsumptionMapProps {
  puntos: MapaPuntoConsumo[];
  selectedId?: string | null;
  focusPoint?: MapaPuntoConsumo | null;
  onSelect: (punto: MapaPuntoConsumo) => void;
}

export default function ConsumptionMap({
  puntos,
  selectedId,
  focusPoint = null,
  onSelect,
}: ConsumptionMapProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const contratos = useMemo(
    () => puntos.filter((p) => !p.tipo || p.tipo === 'CONTRATO' || p.tipo === 'ZONA_CRITICA'),
    [puntos],
  );
  const radiobases = useMemo(() => puntos.filter((p) => p.tipo === 'RADIOBASE'), [puntos]);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={COCHABAMBA_CENTER}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController focusPoint={focusPoint} puntos={contratos} />

        {contratos.map((p) => {
          const isSelected = p.id === selectedId;
          const isCritica = p.tipo === 'ZONA_CRITICA';
          const radius = isCritica ? 12 : isSelected ? 10 : 7;
          const color = ESTADO_COLORS[p.estado];
          return (
            <CircleMarker
              key={p.id}
              center={[p.latitud, p.longitud]}
              radius={radius}
              pathOptions={{
                color: isSelected ? '#0c4a8a' : color,
                fillColor: color,
                fillOpacity: isCritica ? 0.35 : 0.75,
                weight: isSelected ? 3 : isCritica ? 2 : 1.5,
                dashArray: isCritica ? '4 4' : undefined,
              }}
              eventHandlers={{ click: () => onSelect(p) }}
            >
              <Popup>
                <div className="min-w-[180px] text-xs">
                  <p className="font-semibold text-slate-800">{p.titular}</p>
                  <p>
                    <span className="text-slate-500">Contrato:</span> {p.contrato}
                  </p>
                  <p>
                    <span className="text-slate-500">Medidor:</span> {p.medidor}
                  </p>
                  <p>
                    <span className="text-slate-500">Distrito:</span> {p.distrito}
                  </p>
                  <p>
                    <span className="text-slate-500">Zona:</span> {p.zona}
                  </p>
                  <p>
                    <span className="text-slate-500">Consumo:</span> {p.consumoM3} m³
                  </p>
                  <p>
                    <span className="text-slate-500">Monto:</span> Bs {p.montoBs.toFixed(2)}
                  </p>
                  <p>
                    <span className="text-slate-500">Estado:</span> {ESTADO_LABELS[p.estado]}
                  </p>
                  {p.ultimaLectura && (
                    <p>
                      <span className="text-slate-500">Última lectura:</span>{' '}
                      {new Date(p.ultimaLectura).toLocaleString('es-BO', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {radiobases.map((rb) => (
          <CircleMarker
            key={rb.id}
            center={[rb.latitud, rb.longitud]}
            radius={9}
            pathOptions={{
              color: '#6366f1',
              fillColor: '#818cf8',
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-semibold">{rb.titular}</p>
                <p>Radiobase IoT — cobertura LoRaWAN</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md">
        <p className="mb-1 font-semibold text-slate-700">Leyenda</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ESTADO_COLORS).map(([estado, color]) => (
            <span key={estado} className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              {ESTADO_LABELS[estado as MapaPuntoConsumo['estado']]}
            </span>
          ))}
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400" />
            Radiobase
          </span>
        </div>
      </div>
    </div>
  );
}
