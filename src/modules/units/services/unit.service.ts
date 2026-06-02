import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create({
      ...createUnitDto,
      uuid: randomUUID(),
    });
    return await this.unitRepository.save(unit);
  }

  async findAll(): Promise<Unit[]> {
    return await this.unitRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);
    Object.assign(unit, updateUnitDto);
    return await this.unitRepository.save(unit);
  }

  async remove(id: number): Promise<void> {
    const unit = await this.findOne(id);
    await this.unitRepository.remove(unit);
  }
}