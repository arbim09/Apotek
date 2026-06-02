import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password saat ini',
    example: 'admin123456',
  })
  @IsString()
  current_password: string;

  @ApiProperty({
    description: 'Password baru (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, dan angka)',
    example: 'Admin123456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password baru minimal 6 karakter' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
  })
  new_password: string;

  @ApiProperty({
    description: 'Konfirmasi password baru',
    example: 'Admin123456',
  })
  @IsString()
  confirm_new_password: string;

  validate() {
    if (this.new_password !== this.confirm_new_password) {
      throw new Error('Password baru dan konfirmasi password tidak sama');
    }
  }
}