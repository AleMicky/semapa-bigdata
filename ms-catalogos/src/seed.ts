import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Contrato } from './domain/entities/contrato.entity';
import { DistritoZona } from './domain/entities/distrito-zona.entity';
import { Infraestructura } from './domain/entities/infraestructura.entity';
import { Medidor } from './domain/entities/medidor.entity';
import { ModeloMedidor } from './domain/entities/modelo-medidor.entity';
import { Tarifario } from './domain/entities/tarifario.entity';

const SUBALCALDIAS = [
  'Centro',
  'Norte',
  'Sur',
  'Este',
  'Oeste',
  'Valle',
];

const DISTRITOS = [
  'Distrito 1',
  'Distrito 2',
  'Distrito 3',
  'Distrito 4',
  'Distrito 5',
  'Distrito 6',
  'Distrito 7',
  'Distrito 8',
  'Distrito 9',
  'Distrito 10',
  'Distrito 11',
  'Distrito 12',
  'Distrito 13',
  'Distrito 14',
];

const CATEGORIAS = [
  { categoria: 'Doméstico', subcategoria: 'Residencial' },
  { categoria: 'Comercial', subcategoria: 'Pequeño' },
  { categoria: 'Comercial', subcategoria: 'Mediano' },
  { categoria: 'Industrial', subcategoria: 'Ligera' },
  { categoria: 'Industrial', subcategoria: 'Pesada' },
  { categoria: 'Institucional', subcategoria: 'Educación' },
  { categoria: 'Institucional', subcategoria: 'Salud' },
  { categoria: 'Social', subcategoria: 'Vivienda Social' },
  { categoria: 'Especial', subcategoria: 'Fuente Pública' },
];

const MODELOS = [
  {
    tipoMedidorId: 'TM-001',
    marca: 'Sensus',
    modelo: 'iPERL',
    tipoConectividad: 'LoRaWAN',
  },
  {
    tipoMedidorId: 'TM-002',
    marca: 'Kamstrup',
    modelo: 'flowIQ 2200',
    tipoConectividad: 'NB-IoT',
  },
  {
    tipoMedidorId: 'TM-003',
    marca: 'Diehl',
    modelo: 'HYDRUS 2.0',
    tipoConectividad: 'LoRaWAN',
  },
  {
    tipoMedidorId: 'TM-004',
    marca: 'Elster',
    modelo: 'V200',
    tipoConectividad: 'GPRS',
  },
  {
    tipoMedidorId: 'TM-005',
    marca: 'Itron',
    modelo: 'Aquadis+',
    tipoConectividad: 'NB-IoT',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const distritoRepo = app.get<Repository<DistritoZona>>(
    getRepositoryToken(DistritoZona),
  );
  const tarifarioRepo = app.get<Repository<Tarifario>>(
    getRepositoryToken(Tarifario),
  );
  const modeloRepo = app.get<Repository<ModeloMedidor>>(
    getRepositoryToken(ModeloMedidor),
  );
  const infraRepo = app.get<Repository<Infraestructura>>(
    getRepositoryToken(Infraestructura),
  );
  const contratoRepo = app.get<Repository<Contrato>>(
    getRepositoryToken(Contrato),
  );
  const medidorRepo = app.get<Repository<Medidor>>(
    getRepositoryToken(Medidor),
  );

  await distritoRepo.clear();
  await tarifarioRepo.clear();
  await modeloRepo.clear();
  await medidorRepo.clear();
  await contratoRepo.clear();
  await infraRepo.clear();

  const zonas: DistritoZona[] = [];
  let zonaIndex = 1;
  for (let d = 0; d < 14; d++) {
    const subalcaldia = SUBALCALDIAS[d % SUBALCALDIAS.length];
    const distrito = DISTRITOS[d];
    for (let z = 0; z < 4; z++) {
      zonas.push(
        distritoRepo.create({
          subalcaldia,
          distrito,
          subdistrito: z % 2 === 0 ? `Sub-${zonaIndex}` : null,
          zona: `Zona ${zonaIndex}`,
          radiobase: `RB-${String(zonaIndex).padStart(3, '0')}`,
          latitud: -17.38 + zonaIndex * 0.001,
          longitud: -66.15 + zonaIndex * 0.001,
          habitantes: 500 + zonaIndex * 10,
          totalContratos: 20 + zonaIndex,
        }),
      );
      zonaIndex++;
    }
  }
  await distritoRepo.save(zonas);
  console.log(`Insertadas ${zonas.length} zonas/distritos`);

  const tarifarios = CATEGORIAS.map((cat, i) =>
    tarifarioRepo.create({
      ...cat,
      fijo12m3: 15 + i,
      tarifaBase: 3.5 + i * 0.2,
      rango13_25: 4.0 + i * 0.1,
      rango26_50: 5.0 + i * 0.1,
      rango51_75: 6.0 + i * 0.1,
      rango76_100: 7.0 + i * 0.1,
      rango101_150: 8.0 + i * 0.1,
      rangoMayor151: 9.5 + i * 0.1,
      descripcion: `Tarifa ${cat.categoria} - ${cat.subcategoria}`,
    }),
  );
  await tarifarioRepo.save(tarifarios);
  console.log(`Insertados ${tarifarios.length} tarifarios`);

  const modelos = MODELOS.map((m) => modeloRepo.create(m));
  await modeloRepo.save(modelos);
  console.log(`Insertados ${modelos.length} modelos de medidor`);

  const infraestructuras: Infraestructura[] = [];
  for (let i = 1; i <= 20; i++) {
    const zona = zonas[i % zonas.length];
    infraestructuras.push(
      infraRepo.create({
        numeroCatastro: `CAT-${String(i).padStart(5, '0')}`,
        propietario: `Propietario ${i}`,
        ci: `${10000000 + i}`,
        direccion: `Av. SEMAPA ${i}, Zona ${zona.zona}`,
        zona: zona.zona,
        distrito: zona.distrito,
        manzano: `${i}`,
        lote: `${i * 2}`,
        superficieTerreno: 200 + i * 5,
        areaConstruida: 120 + i * 3,
        usoSuelo: i % 2 === 0 ? 'Residencial' : 'Comercial',
        valorCatastral: 50000 + i * 1000,
        impuestoAnual: 500 + i * 10,
        latitud: zona.latitud,
        longitud: zona.longitud,
      }),
    );
  }
  await infraRepo.save(infraestructuras);
  console.log(`Insertadas ${infraestructuras.length} infraestructuras`);

  const contratos: Contrato[] = [];
  const medidores: Medidor[] = [];
  for (let i = 1; i <= 20; i++) {
    const infra = infraestructuras[i - 1];
    const cat = CATEGORIAS[i % CATEGORIAS.length];
    const medidorIot = `IOT-${String(i).padStart(5, '0')}`;
    contratos.push(
      contratoRepo.create({
        numeroContrato: `CTR-${String(i).padStart(5, '0')}`,
        numeroCatastro: infra.numeroCatastro,
        titularContrato: infra.propietario,
        ciTitular: infra.ci,
        telefono: `7${String(1000000 + i).slice(0, 7)}`,
        categoria: cat.categoria,
        subcategoria: cat.subcategoria,
        medidorIot,
        fechaContrato: new Date(2020 + (i % 4), i % 12, 1),
        estadoContrato: 'ACTIVO',
        diametroConexion: i % 2 === 0 ? '1/2"' : '3/4"',
        tipoServicio: 'Agua Potable',
      }),
    );
    medidores.push(
      medidorRepo.create({
        medidorIot,
        tipoMedidorId: MODELOS[i % MODELOS.length].tipoMedidorId,
        fechaInstalacion: new Date(2021 + (i % 3), i % 12, 15),
        estado: 'INSTALADO',
      }),
    );
  }
  await contratoRepo.save(contratos);
  await medidorRepo.save(medidores);
  console.log(`Insertados ${contratos.length} contratos y ${medidores.length} medidores`);

  await app.close();
  console.log('Seed de ms-catalogos completado');
}

seed().catch((error) => {
  console.error('Error en seed:', error);
  process.exit(1);
});
