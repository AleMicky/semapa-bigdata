import { KioskButton } from '@/components/kiosk-button';

export default function HomePage() {
  return (
    <main className="kiosk-shell">
      <header className="kiosk-header">
        <p className="kiosk-logo">SEMAPA</p>
        <h1 className="kiosk-title">Autoservicio Ciudadano</h1>
        <p className="kiosk-subtitle">Consulte su consumo, deuda y preaviso de agua</p>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-6">
        <KioskButton href="/consulta?tipo=ci">Consultar por CI</KioskButton>
        <KioskButton href="/consulta?tipo=contrato" variant="secondary">
          Consultar por Contrato
        </KioskButton>
        <KioskButton href="/consulta?tipo=medidor" variant="secondary">
          Consultar por Medidor
        </KioskButton>
      </div>

      <footer className="mt-10 text-center text-xl text-slate-500">
        Servicio de Aguas Potables y Alcantarillado — Cochabamba
      </footer>
    </main>
  );
}
