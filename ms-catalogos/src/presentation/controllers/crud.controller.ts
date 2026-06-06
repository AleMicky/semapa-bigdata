import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';

export abstract class CrudController<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly service: {
      findAll(): Promise<T[]>;
      findById(id: string): Promise<T>;
      create(data: CreateDto | Partial<T>): Promise<T>;
      update(id: string, data: UpdateDto | Partial<T>): Promise<T>;
      remove(id: string): Promise<void>;
    },
  ) {}

  @Get()
  findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<T> {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateDto): Promise<T> {
    return this.service.create(dto as never);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDto): Promise<T> {
    return this.service.update(id, dto as never);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
