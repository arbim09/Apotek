import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UsersService } from './users.service';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Omit<User, 'password_hash'>;
    redirect_to: string;
  }> {
    // Validate that either email or username is provided
    if (!loginDto.email && !loginDto.username) {
      throw new BadRequestException('Email atau username harus diisi');
    }

    // Find user by email or username
    let user = await this.usersService.findByEmail(loginDto.email || '');
    if (!user && loginDto.username) {
      user = await this.usersService.findByUsername(loginDto.username);
    }

    if (!user) {
      throw new UnauthorizedException('Email/username atau password salah');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Akun Anda telah dinonaktifkan');
    }

    // Verify password
    const isPasswordValid = await this.jwtService.comparePassword(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email/username atau password salah');
    }

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.generateAccessToken(payload);
    const refresh_token = await this.jwtService.generateRefreshToken(payload);

    // Save refresh token to database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await this.refreshTokenRepository.save({
      user_id: user.id,
      token: refresh_token,
      expires_at: refreshTokenExpiry,
    });

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Determine redirect URL based on role
    const redirectMap = {
      admin: '/admin/dashboard',
      apoteker: '/apoteker/dashboard',
      pemilik: '/pemilik/dashboard',
    };

    const { password_hash, ...userWithoutPassword } = user;

    return {
      access_token,
      refresh_token,
      user: userWithoutPassword,
      redirect_to: redirectMap[user.role] || '/dashboard',
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    // Verify refresh token format
    const decoded = this.jwtService.verifyToken(refreshTokenDto.refresh_token);
    if (!decoded) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    // Check if refresh token exists in database and not revoked
    const storedToken = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshTokenDto.refresh_token,
        is_revoked: false,
      },
    });

    if (!storedToken || new Date() > storedToken.expires_at) {
      throw new UnauthorizedException('Refresh token telah kadaluarsa');
    }

    // Verify user still exists and active
    const user = await this.usersService.findById(decoded.sub);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User tidak valid atau tidak aktif');
    }

    // Generate new tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const new_access_token = await this.jwtService.generateAccessToken(payload);
    const new_refresh_token = await this.jwtService.generateRefreshToken(payload);

    // Revoke old refresh token
    await this.refreshTokenRepository.update(
      { id: storedToken.id },
      { is_revoked: true },
    );

    // Save new refresh token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    await this.refreshTokenRepository.save({
      user_id: user.id,
      token: new_refresh_token,
      expires_at: refreshTokenExpiry,
    });

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token,
    };
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Token tidak valid');
    }

    // Revoke all refresh tokens for this user
    await this.refreshTokenRepository.update(
      { user_id: decoded.sub },
      { is_revoked: true },
    );
  }

  async validateToken(token: string): Promise<any> {
    return this.jwtService.verifyToken(token);
  }
}