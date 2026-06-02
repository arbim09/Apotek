import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';
import { Unit } from '../../modules/units/entities/unit.entity';
import { Supplier } from '../../modules/suppliers/entities/supplier.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { randomUUID } from 'crypto';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  const categoryRepo = dataSource.getRepository(Category);
  const unitRepo = dataSource.getRepository(Unit);
  const supplierRepo = dataSource.getRepository(Supplier);
  const productRepo = dataSource.getRepository(Product);

  try {
    // 1. Seed Categories
    console.log('Seeding categories...');
    const categoriesData = [
      { name: 'Obat Bebas', description: 'Obat yang dapat dibeli tanpa resep dokter' },
      { name: 'Obat Keras', description: 'Obat yang hanya dapat dibeli dengan resep dokter' },
      { name: 'Alat Kesehatan', description: 'Peralatan medis dan kesehatan' },
      { name: 'Vitamin & Suplemen', description: 'Suplemen kesehatan dan vitamin' },
    ];

    const categories: Record<string, number> = {};
    for (const data of categoriesData) {
      let cat = await categoryRepo.findOne({ where: { name: data.name } });
      if (!cat) {
        cat = await categoryRepo.save(categoryRepo.create({
          ...data,
          uuid: randomUUID(),
        }));
        console.log(`✓ Category created: ${data.name}`);
      }
      categories[data.name] = cat.id;
    }

    // 2. Seed Units
    console.log('\nSeeding units...');
    const unitsData = [
      { name: 'Tablet', description: 'Bentuk sediaan tablet' },
      { name: 'Kapsul', description: 'Bentuk sediaan kapsul' },
      { name: 'Botol', description: 'Kemasan botol' },
      { name: 'Strip', description: 'Kemasan strip' },
      { name: 'Pcs', description: 'Satuan unit terkecil' },
    ];

    const units: Record<string, number> = {};
    for (const data of unitsData) {
      let unit = await unitRepo.findOne({ where: { name: data.name } });
      if (!unit) {
        unit = await unitRepo.save(unitRepo.create({
          ...data,
          uuid: randomUUID(),
        }));
        console.log(`✓ Unit created: ${data.name}`);
      }
      units[data.name] = unit.id;
    }

    // 3. Seed Suppliers
    console.log('\nSeeding suppliers...');
    const suppliersData = [
      { supplier_code: 'SPL001', name: 'PT Kimia Farma', sales_name: 'Budi Santoso', phone: '021-1234567', email: 'sales@kimiafarma.com', address: 'Jakarta' },
      { supplier_code: 'SPL002', name: 'PT Enseval Putera MegaTrade', sales_name: 'Siti Aminah', phone: '021-7654321', email: 'info@enseval.com', address: 'Tangerang' },
      { supplier_code: 'SPL003', name: 'PT Anugerah Pharmindo', sales_name: 'Andi Wijaya', phone: '021-9876543', email: 'contact@aps.com', address: 'Bekasi' },
    ];

    const suppliers: Record<string, number> = {};
    for (const data of suppliersData) {
      let supplier = await supplierRepo.findOne({ where: { name: data.name } });
      if (!supplier) {
        supplier = await supplierRepo.save(supplierRepo.create({
          ...data,
          uuid: randomUUID(),
        }));
        console.log(`✓ Supplier created: ${data.name}`);
      }
      suppliers[data.name] = supplier.id;
    }

    // 4. Seed Products
    console.log('\nSeeding products...');
    const productsData = [
      {
        product_code: 'PRD001',
        barcode: '899123456001',
        name: 'Paracetamol 500mg',
        categoryName: 'Obat Bebas',
        unitName: 'Tablet',
        supplierName: 'PT Kimia Farma',
        purchase_price: 500,
        selling_price: 1000,
        stock: 1000,
        minimum_stock: 100,
        batch_number: 'BATCH001',
        rack_location: 'A1',
        status: 'active',
      },
      {
        product_code: 'PRD002',
        barcode: '899123456002',
        name: 'Amoxicillin 500mg',
        categoryName: 'Obat Keras',
        unitName: 'Kapsul',
        supplierName: 'PT Enseval Putera MegaTrade',
        purchase_price: 1200,
        selling_price: 2000,
        stock: 500,
        minimum_stock: 50,
        batch_number: 'BATCH002',
        rack_location: 'B2',
        status: 'active',
      },
      {
        product_code: 'PRD003',
        barcode: '899123456003',
        name: 'Vitamin C 1000mg',
        categoryName: 'Vitamin & Suplemen',
        unitName: 'Strip',
        supplierName: 'PT Anugerah Pharmindo',
        purchase_price: 3000,
        selling_price: 5000,
        stock: 200,
        minimum_stock: 20,
        batch_number: 'BATCH003',
        rack_location: 'C1',
        status: 'active',
      },
      {
        product_code: 'PRD004',
        barcode: '899123456004',
        name: 'Termometer Digital',
        categoryName: 'Alat Kesehatan',
        unitName: 'Pcs',
        supplierName: 'PT Kimia Farma',
        purchase_price: 25000,
        selling_price: 45000,
        stock: 50,
        minimum_stock: 10,
        batch_number: 'BATCH004',
        rack_location: 'D1',
        status: 'active',
      },
    ];

    for (const data of productsData) {
      const existingProduct = await productRepo.findOne({ where: { product_code: data.product_code } });
      if (!existingProduct) {
        // Destructure to separate relation names from product properties
        const { categoryName, unitName, supplierName, ...productProps } = data;
        
        await productRepo.save(productRepo.create({
          ...productProps,
          uuid: randomUUID(),
          category: { id: categories[categoryName] } as any,
          unit: { id: units[unitName] } as any,
          supplier: { id: suppliers[supplierName] } as any,
        }));
        console.log(`✓ Product created: ${data.name}`);
      } else {
        console.log(`⊗ Product already exists: ${data.name}`);
      }
    }

    console.log('\n✅ Product seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error instanceof Error ? error.message : String(error));
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});