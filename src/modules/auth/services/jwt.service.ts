import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateAccessToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: any): Promise<string> {
    // Generate refresh token with longer expiration
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('jwt.refreshExpiration', '7d'),
    } as any);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}