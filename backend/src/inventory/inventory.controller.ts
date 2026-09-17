import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('ingredients')
  @Roles(Role.ADMIN)
  getIngredients() {
    return this.inventoryService.getIngredients();
  }

  @Post('ingredients')
  @Roles(Role.ADMIN)
  createIngredient(@Body() data: any) {
    return this.inventoryService.createIngredient(data);
  }

  @Patch('ingredients/:id')
  @Roles(Role.ADMIN)
  updateIngredient(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.inventoryService.updateIngredient(id, data);
  }

  @Delete('ingredients/:id')
  @Roles(Role.ADMIN)
  deleteIngredient(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteIngredient(id);
  }

  @Post('movements')
  @Roles(Role.ADMIN)
  recordMovement(@Body() data: any) {
    // Expected: { ingredientId, quantity, type, reason }
    return this.inventoryService.recordMovement(data);
  }

  @Get('movements')
  @Roles(Role.ADMIN)
  getMovements() {
    return this.inventoryService.getMovements();
  }
}
