import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('Authentication')

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login dengan email/username dan password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil, return access_token dan refresh_token' })
  @ApiResponse({ status: 401, description: 'Email/username atau password salah' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token menggunakan refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token berhasil di-refresh' })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid atau sudah expired' })
  async refresh(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout dan revoke semua tokens' })
  @ApiResponse({ status: 200, description: 'Logout berhasil' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req: any) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
      await this.authService.logout(token);
    }
    return { message: 'Logout berhasil' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Ambil profil user yang sedang login' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) {
      return null;
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Ubah password user' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password berhasil diubah' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Password saat ini tidak sesuai' })
  async changePassword(
    @Request() req: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    changePasswordDto.validate();
    await this.usersService.changePassword(req.user.sub, changePasswordDto);
    return { message: 'Password berhasil diubah' };
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Validate apakah token masih valid' })
  @ApiResponse({ status: 200, description: 'Token valid' })
  @ApiResponse({ status: 401, description: 'Token tidak valid' })
  async validateToken(@Request() req: any) {
    return { valid: true, user: req.user };
  }
}