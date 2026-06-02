import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { status: 'active' },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { category_id, unit_id, supplier_id, ...rest } = createProductDto;
    
    const product = this.productRepository.create({
      ...rest,
      category: { id: category_id } as any,
      unit: { id: unit_id } as any,
      supplier: { id: supplier_id } as any,
    });
    
    return await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    const { category_id, unit_id, supplier_id, ...rest } = updateProductDto;
    
    Object.assign(product, rest);
    
    if (category_id) product.category = { id: category_id } as any;
    if (unit_id) product.unit = { id: unit_id } as any;
    if (supplier_id) product.supplier = { id: supplier_id } as any;
    
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async softDelete(id: number): Promise<Product> {
    const product = await this.findOne(id);
    product.status = 'inactive';
    return await this.productRepository.save(product);
  }
}