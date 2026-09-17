"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const inventory_service_1 = require("../inventory/inventory.service");
let OrdersService = class OrdersService {
    prisma;
    inventoryService;
    constructor(prisma, inventoryService) {
        this.prisma = prisma;
        this.inventoryService = inventoryService;
    }
    async createOrder(data) {
        if (!data.items || data.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        let subtotal = 0;
        const deliveryCost = data.type === 'DELIVERY' ? 500 : 0;
        const orderItems = [];
        for (const item of data.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId }
            });
            if (!product)
                throw new common_1.BadRequestException(`Product ${item.productId} not found`);
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
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                type: data.type,
                customerAddress: data.deliveryAddress || null,
                subtotal,
                deliveryCost,
                total,
                status: client_1.OrderStatus.PENDING,
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
    async updateOrderStatus(id, status) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status === 'PENDING' && (status === 'CONFIRMED' || status === 'PREPARING')) {
            const consumedIngredients = new Map();
            for (const item of order.items) {
                if (item.product.recipe) {
                    for (const recipeItem of item.product.recipe) {
                        const current = consumedIngredients.get(recipeItem.ingredientId) || 0;
                        consumedIngredients.set(recipeItem.ingredientId, current + (recipeItem.quantity * item.quantity));
                    }
                }
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
            for (const [ingredientId, quantity] of consumedIngredients.entries()) {
                await this.inventoryService.recordMovement({
                    ingredientId,
                    quantity: -quantity,
                    type: client_1.MovementType.SALE,
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map