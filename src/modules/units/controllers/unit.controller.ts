import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { UnitService } from '../services/unit.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return await this.unitService.create(createUnitDto);
  }

  @Get()
  async findAll(): Promise<Unit[]> {
    return await this.unitService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Unit> {
    return await this.unitService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return await this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.unitService.remove(id);
  }
}