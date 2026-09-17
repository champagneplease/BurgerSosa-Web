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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogService = class CatalogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFullCatalog() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        modifiers: true
                    }
                }
            }
        });
    }
    async getAdminCatalog() {
        return this.prisma.category.findMany({
            orderBy: { order: 'asc' },
            include: {
                products: {
                    include: {
                        modifiers: true
                    }
                }
            }
        });
    }
    async createProduct(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                image: data.image,
                categoryId: data.categoryId,
                isActive: data.isActive ?? true,
            }
        });
    }
    async updateProduct(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async createCategory(data) {
        return this.prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
                order: data.order ?? 0,
                isActive: data.isActive ?? true,
            }
        });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async deleteCategory(id) {
        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map