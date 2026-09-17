import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovementType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getIngredients() {
    return this.prisma.ingredient.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async createIngredient(data: any) {
    return this.prisma.ingredient.create({
      data: {
        name: data.name,
        unit: data.unit,
        currentStock: Number(data.currentStock) || 0,
        minStock: Number(data.minStock) || 0,
      }
    });
  }

  async updateIngredient(id: number, data: any) {
    return this.prisma.ingredient.update({
      where: { id },
      data
    });
  }

  async deleteIngredient(id: number) {
    return this.prisma.ingredient.delete({
      where: { id }
    });
  }

  async recordMovement(data: { ingredientId: number, quantity: number, type: MovementType, reason?: string, userId?: number, referenceId?: number }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create movement
      const movement = await tx.stockMovement.create({
        data: {
          ingredientId: data.ingredientId,
          quantity: data.quantity,
          type: data.type,
          reason: data.reason,
          userId: data.userId,
          referenceId: data.referenceId
        }
      });

      // 2. Update current stock
      await tx.ingredient.update({
        where: { id: data.ingredientId },
        data: {
          currentStock: {
            increment: data.quantity // If quantity is negative, it will decrement
          }
        }
      });

      return movement;
    });
  }

  async getMovements(ingredientId?: number) {
    return this.prisma.stockMovement.findMany({
      where: ingredientId ? { ingredientId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { ingredient: true, user: true },
      take: 50
    });
  }
}
