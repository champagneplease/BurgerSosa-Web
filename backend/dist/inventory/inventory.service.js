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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getIngredients() {
        return this.prisma.ingredient.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async createIngredient(data) {
        return this.prisma.ingredient.create({
            data: {
                name: data.name,
                unit: data.unit,
                currentStock: Number(data.currentStock) || 0,
                minStock: Number(data.minStock) || 0,
            }
        });
    }
    async updateIngredient(id, data) {
        return this.prisma.ingredient.update({
            where: { id },
            data
        });
    }
    async deleteIngredient(id) {
        return this.prisma.ingredient.delete({
            where: { id }
        });
    }
    async recordMovement(data) {
        return this.prisma.$transaction(async (tx) => {
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
            await tx.ingredient.update({
                where: { id: data.ingredientId },
                data: {
                    currentStock: {
                        increment: data.quantity
                    }
                }
            });
            return movement;
        });
    }
    async getMovements(ingredientId) {
        return this.prisma.stockMovement.findMany({
            where: ingredientId ? { ingredientId } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { ingredient: true, user: true },
            take: 50
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map