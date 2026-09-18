import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Temporary fix for admin password
  const prisma = app.get(PrismaService);
  const admin = await prisma.user.findUnique({ where: { email: 'admin@burgersosa.com' } });
  if (admin) {
    const isOldPassword = await bcrypt.compare('hashedpassword123', admin.password);
    if (isOldPassword) {
      const newHash = await bcrypt.hash('burgersosa24', 10);
      await prisma.user.update({
        where: { email: 'admin@burgersosa.com' },
        data: { password: newHash }
      });
      console.log('Admin password migrated successfully.');
    }
  }

  // Retroactive modifier sync for hamburgers
  const burgerCategories = await prisma.category.findMany();
  const burgerCategoryIds = burgerCategories
    .filter(c => c.name.toLowerCase().includes('hamburguesa'))
    .map(c => c.id);

  if (burgerCategoryIds.length > 0) {
    const productsWithoutModifiers = await prisma.product.findMany({
      where: {
        categoryId: { in: burgerCategoryIds },
        modifiers: { none: {} }
      }
    });

    for (const p of productsWithoutModifiers) {
      await prisma.modifier.createMany({
        data: [
          { name: 'Medallón Extra', price: 2000, productId: p.id, isActive: true },
          { name: 'Sin Cebolla', price: 0, productId: p.id, isActive: true }
        ]
      });
      console.log(`Synced default modifiers for existing product ${p.name}`);
    }
  }

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
