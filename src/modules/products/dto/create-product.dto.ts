import { IsString, IsNumber, IsOptional, Min, MaxLength, IsDateString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  product_code: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  category_id: number;

  @IsNumber()
  unit_id: number;

  @IsNumber()
  supplier_id: number;

  @IsNumber()
  @Min(0)
  purchase_price: number;

  @IsNumber()
  @Min(0)
  selling_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimum_stock?: number;

  @IsOptional()
  @IsDateString()
  expired_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  batch_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  rack_location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}