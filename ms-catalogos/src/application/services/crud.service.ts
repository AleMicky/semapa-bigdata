import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../infrastructure/repositories/base.repository';

@Injectable()
export class CrudService<T extends { id: string }> {
  constructor(private readonly repository: BaseRepository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    return entity;
  }

  create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
  }
}
