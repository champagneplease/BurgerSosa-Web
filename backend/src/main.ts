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
