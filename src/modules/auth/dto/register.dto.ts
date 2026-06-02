import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username minimal 3 karakter' })
  @MaxLength(50, { message: 'Username maksimal 50 karakter' })
  username?: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
  })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Nama lengkap minimal 2 karakter' })
  @MaxLength(255, { message: 'Nama lengkap maksimal 255 karakter' })
  full_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Nomor telepon maksimal 20 karakter' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role harus admin, apoteker, atau pemilik' })
  role?: UserRole = UserRole.APOTEKER;
}