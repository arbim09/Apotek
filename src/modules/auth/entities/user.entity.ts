import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index, Generated } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export enum UserRole {
  ADMIN = 'admin',
  APOTEKER = 'apoteker',
  PEMILIK = 'pemilik',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  @Index()
  username: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.APOTEKER,
    nullable: false,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refresh_tokens: RefreshToken[];
}