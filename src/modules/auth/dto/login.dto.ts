import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'Email user (alternatif dari username)',
    example: 'admin@apotek.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email harus valid' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Username user (alternatif dari email)',
    example: 'admin',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username minimal 3 karakter' })
  @MaxLength(50, { message: 'Username maksimal 50 karakter' })
  username?: string;

  @ApiProperty({
    description: 'Password user',
    example: 'admin123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
