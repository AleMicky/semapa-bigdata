# totem-web — Tótem de Autoservicio Ciudadano SEMAPA

Interfaz de consulta ciudadana para tótem táctil. Permite consultar consumo, deuda y preaviso de agua por **CI**, **contrato** o **medidor**. No incluye administración ni autenticación.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Axios
- pdfmake (descarga e impresión de preaviso)

## Inicio rápido (local)

```bash
cd totem-web
cp .env.example .env
npm install
npm run dev
```

Abrir: [http://localhost:3007](http://localhost:3007)

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL del API Gateway | `http://localhost:3000` |

## Endpoints consumidos

```
GET /totem/consulta?tipo=ci&valor=123456
GET /totem/consulta?tipo=contrato&valor=10001
GET /totem/consulta?tipo=medidor&valor=MED-0001
```

Si el backend no responde, la aplicación usa **datos mock** para que la demo funcione visualmente.

## Flujo de pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — selección de tipo de consulta |
| `/consulta?tipo=ci\|contrato\|medidor` | Ingreso con teclado virtual |
| `/resultado` | Datos del titular, consumo, historial y acciones |
| `/error` | Sin resultados |

## Docker

```bash
# Desde la raíz del monorepo
docker compose up totem-web --build
```

Puerto expuesto: **3007** → contenedor **3000**

> **Nota:** Las llamadas API se ejecutan desde el navegador del usuario. En Docker, `NEXT_PUBLIC_API_URL` debe apuntar a una URL accesible desde el host (p. ej. `http://localhost:3000`), no a `http://api-gateway:3000`.

## Estructura

```
src/
├── app/           # Páginas Next.js
├── components/    # UI reutilizable para kiosco
├── lib/           # API, mock y PDF
└── types/         # Tipos TypeScript
```

## Acciones del resultado

- Descargar PDF de preaviso
- Ver QR de validación
- Imprimir preaviso
- Nueva consulta
- Volver al inicio
