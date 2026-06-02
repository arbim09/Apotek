import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}