import { Repository, ObjectLiteral } from 'typeorm';
import { IBaseRepository } from '../../domain/repositories/base.repository.interface';

export class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find({ where: { active: true } as never });
  }

  findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id, active: true } as never });
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as never);
    const saved = await this.repository.save(entity);
    return (Array.isArray(saved) ? saved[0] : saved) as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    Object.assign(existing, data);
    return this.repository.save(existing);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { active: false } as never);
    return (result.affected ?? 0) > 0;
  }
}
