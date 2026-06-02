import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  @Index()
  user_id: number;

  @Column({ type: 'varchar', length: 500, unique: true, nullable: false })
  @Index()
  token: string;

  @Column({ type: 'timestamp', nullable: false })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  is_revoked: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.refresh_tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}