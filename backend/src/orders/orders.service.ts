import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderType, OrderStatus, MovementType } from '@prisma/client';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService
  ) {}

  async createOrder(data: any) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let subtotal = 0;
    const deliveryCost = data.type === 'DELIVERY' ? 500 : 0; // Fixed delivery cost for now
    const orderItems = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) throw new BadRequestException(`Product ${item.productId} not found`);

      let productBasePrice = Number(product.price);
      let itemModifiersCost = 0;
      const modifierConnections = [];

      if (item.modifiers && item.modifiers.length > 0) {
        for (const modId of item.modifiers) {
          const modifier = await this.prisma.modifier.findUnique({
            where: { id: modId }
          });
          if (modifier) {
            itemModifiersCost += Number(modifier.price);
            modifierConnections.push({ 
              modifierId: modifier.id,
              unitPriceCaptured: modifier.price
            });
          }
        }
      }

      const itemTotal = (productBasePrice + itemModifiersCost) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPriceCaptured: product.price,
        notes: item.notes,
        modifiers: {
          create: modifierConnections
        }
      });
    }

    const total = subtotal + deliveryCost;
    // Generar un número de orden único corto
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        type: data.type as OrderType,
        customerAddress: data.deliveryAddress || null, // Map deliveryAddress from frontend to customerAddress
        subtotal,
        deliveryCost,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      }
    });

    return order;
  }

  async getOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        items: {
          include: {
            product: true,
            modifiers: { include: { modifier: true } }
          }
        }
      }
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { recipe: true }
            },
            modifiers: {
              include: {
                modifier: {
                  include: { ingredients: true }
                }
              }
            }
          }
        }
      }
    });

    if (!order) throw new NotFoundException('Order not found');

    // Descuento de stock si pasa de PENDING a CONFIRMED o PREPARING
    if (order.status === 'PENDING' && (status === 'CONFIRMED' || status === 'PREPARING')) {
      const consumedIngredients = new Map<number, number>();

      for (const item of order.items) {
        // Descontar por la receta base del producto
        if (item.product.recipe) {
          for (const recipeItem of item.product.recipe) {
            const current = consumedIngredients.get(recipeItem.ingredientId) || 0;
            consumedIngredients.set(recipeItem.ingredientId, current + (recipeItem.quantity * item.quantity));
          }
        }
        
        // Descontar por los modificadores elegidos
        if (item.modifiers) {
          for (const orderMod of item.modifiers) {
            if (orderMod.modifier.ingredients) {
              for (const modIng of orderMod.modifier.ingredients) {
                const current = consumedIngredients.get(modIng.ingredientId) || 0;
                consumedIngredients.set(modIng.ingredientId, current + (modIng.quantity * item.quantity));
              }
            }
          }
        }
      }

      // Registrar los movimientos en el inventario
      for (const [ingredientId, quantity] of consumedIngredients.entries()) {
        await this.inventoryService.recordMovement({
          ingredientId,
          quantity: -quantity, // Negativo porque se descuenta del stock
          type: MovementType.SALE,
          reason: `Consumo automático por orden #${order.orderNumber}`,
          referenceId: order.id
        });
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}
