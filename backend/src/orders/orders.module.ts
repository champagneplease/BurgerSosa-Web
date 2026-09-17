import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, InventoryModule, AuthModule, PassportModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
