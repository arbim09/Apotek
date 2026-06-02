import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Unit } from '../../units/entities/unit.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  product_code: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  barcode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Unit, (unit) => unit.products)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false, default: 0 })
  purchase_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false, default: 0 })
  selling_price: number;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'integer', default: 0 })
  minimum_stock: number;

  @Column({ type: 'date', nullable: true })
  expired_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  batch_number: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rack_location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}