import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitController } from './controllers/unit.controller';
import { UnitService } from './services/unit.service';
import { Unit } from './entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitsModule {}