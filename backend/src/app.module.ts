import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule, UsersModule, AuthModule, CatalogModule, OrdersModule, InventoryModule, SettingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
