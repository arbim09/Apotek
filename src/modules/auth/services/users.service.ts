import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<Omit<User, 'password_hash'>> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    });

    if (existingUser) {
      throw new ConflictException('Email atau username sudah terdaftar');
    }

    // Hash password
    const password_hash = await this.jwtService.hashPassword(registerDto.password);

    // Create user
    const user = this.usersRepository.create({
      ...registerDto,
      password_hash,
    });

    const savedUser = await this.usersRepository.save(user);

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        is_active: true,
        full_name: true,
        password_hash: true,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        is_active: true,
        full_name: true,
        password_hash: true,
      },
    });
  }

  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ password_hash, ...user }) => user);
  }

  async findByRole(role: UserRole): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.usersRepository.find({ where: { role } });
    return users.map(({ password_hash, ...user }) => user);
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<Omit<User, 'password_hash'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateData,
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    // Validation now handled in AuthService or via DTO (though we moved it to AuthService for login, 
    // we should check if changePassword also needs similar treatment or if we keep it here).
    // For now, focusing on the password_hash issue.

    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        password_hash: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Verify current password
    const isPasswordValid = await this.jwtService.comparePassword(
      changePasswordDto.current_password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Password saat ini tidak sesuai');
    }

    // Hash new password
    const newPasswordHash = await this.jwtService.hashPassword(changePasswordDto.new_password);

    // Update password
    await this.usersRepository.update(id, { password_hash: newPasswordHash });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.usersRepository.update(id, { last_login: new Date() });
  }
}