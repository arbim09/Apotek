import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UsersService } from '../../modules/auth/services/users.service';
import { UserRole } from '../../modules/auth/entities/user.entity';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const users = [
    {
      email: 'admin@apotek.com',
      username: 'admin',
      password: 'admin123456',
      full_name: 'Admin Apotek',
      phone: '08123456789',
      role: UserRole.ADMIN,
    },
    {
      email: 'apoteker@apotek.com',
      username: 'apoteker',
      password: 'apoteker123456',
      full_name: 'Apoteker Profesional',
      phone: '08234567890',
      role: UserRole.APOTEKER,
    },
    {
      email: 'pemilik@apotek.com',
      username: 'pemilik',
      password: 'pemilik123456',
      full_name: 'Pemilik Apotek',
      phone: '08345678901',
      role: UserRole.PEMILIK,
    },
  ];

  try {
    for (const userData of users) {
      const existingUser = await usersService.findByEmail(userData.email);
      if (!existingUser) {
        await usersService.createUser({
          email: userData.email,
          username: userData.username,
          password: userData.password,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
        });
        console.log(`✓ User created: ${userData.email} (${userData.role})`);
      } else {
        console.log(`⊗ User already exists: ${userData.email}`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
