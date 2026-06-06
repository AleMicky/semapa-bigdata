import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { ErrorIot } from './domain/entities/error-iot.entity';
import { Lectura } from './domain/entities/lectura.entity';
import { EstadoLectura } from './domain/enums/estado-lectura.enum';
import { CrearLecturaUseCase } from './application/use-cases/crear-lectura.use-case';

const MEDIDORES = Array.from({ length: 20 }, (_, i) => `IOT-${String(i + 1).padStart(5, '0')}`);

const ERRORES_IOT = [
  {
    codigoError: 'E001',
    descripcion: 'Gateway sin conexión',
    gatewayId: 'GW-001',
    nombre: 'Gateway Norte',
    direccion: 'Av. Blanco Galindo',
    location: '-17.39,-66.16',
  },
  {
    codigoError: 'E002',
    descripcion: 'Medidor no responde',
    gatewayId: 'GW-002',
    nombre: 'Gateway Sur',
    direccion: 'Av. Circunvalación',
    location: '-17.40,-66.17',
  },
  {
    codigoError: 'E003',
    descripcion: 'Señal débil persistente',
    gatewayId: 'GW-003',
    nombre: 'Gateway Centro',
    direccion: 'Calle Lanza',
    location: '-17.38,-66.15',
  },
  {
    codigoError: 'E004',
    descripcion: 'Batería baja en medidor',
    gatewayId: 'GW-004',
    nombre: 'Gateway Este',
    direccion: 'Av. Petrolera',
    location: '-17.37,-66.14',
  },
  {
    codigoError: 'E005',
    descripcion: 'Paquete corrupto recibido',
    gatewayId: 'GW-005',
    nombre: 'Gateway Oeste',
    direccion: 'Av. Melchor Perez',
    location: '-17.41,-66.18',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const lecturaRepo = app.get<Repository<Lectura>>(getRepositoryToken(Lectura));
  const errorRepo = app.get<Repository<ErrorIot>>(getRepositoryToken(ErrorIot));
  const crearLectura = app.get(CrearLecturaUseCase);

  await lecturaRepo.clear();
  await errorRepo.clear();

  const errores = ERRORES_IOT.map((e) => errorRepo.create(e));
  await errorRepo.save(errores);
  console.log(`Insertados ${errores.length} errores IoT`);

  const fechaBase = new Date();
  let lecturaAnteriorBase = 50;

  for (let i = 0; i < 100; i++) {
    const medidor = MEDIDORES[i % MEDIDORES.length];
    const fecha = new Date(fechaBase);
    fecha.setHours(fecha.getHours() - i);

    const lecturaAnterior = lecturaAnteriorBase + i * 2;
    let lecturaActual = lecturaAnterior + Math.floor(Math.random() * 8) + 1;
    let estado: EstadoLectura | undefined;

    if (i % 17 === 0) {
      estado = EstadoLectura.SIN_SENAL;
      lecturaActual = lecturaAnterior;
    } else if (i % 13 === 0) {
      lecturaActual = lecturaAnterior - 5;
    }

    const lecturaBase = {
      medidorIot: medidor,
      contratoId: `CTR-${String((i % 20) + 1).padStart(5, '0')}`,
      lecturaAnterior,
      lecturaActual,
      fechaHoraLectura: fecha.toISOString(),
      radiobase: `RB-${String((i % 20) + 1).padStart(3, '0')}`,
      ...(estado !== EstadoLectura.SIN_SENAL && {
        rssi: -85 + Math.random() * 15,
        snr: 4 + Math.random() * 8,
      }),
      estado,
    };

    await crearLectura.execute(lecturaBase);

    if (i % 11 === 0 && i > 0) {
      await crearLectura.execute({
        ...lecturaBase,
        lecturaActual: lecturaAnterior + 3,
      });
    }
  }

  const total = await lecturaRepo.count();
  const duplicadas = await lecturaRepo.count({ where: { estado: EstadoLectura.DUPLICADA } });
  const sinSenal = await lecturaRepo.count({ where: { estado: EstadoLectura.SIN_SENAL } });
  const erroresLectura = await lecturaRepo.count({ where: { estado: EstadoLectura.ERROR } });

  console.log(`Insertadas ${total} lecturas`);
  console.log(`  - DUPLICADAS: ${duplicadas}`);
  console.log(`  - SIN_SENAL: ${sinSenal}`);
  console.log(`  - ERROR: ${erroresLectura}`);

  await app.close();
  console.log('Seed de ms-lecturas completado');
}

seed().catch((error) => {
  console.error('Error en seed:', error);
  process.exit(1);
});
