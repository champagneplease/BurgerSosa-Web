import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Category } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getFullCatalog() {
    return this.prisma.category.findMany({
      where: { isActive: true },
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
      include: {
        products: {
          include: {
            modifiers: true
          }
        }
      }
    });
  }

  async createProduct(data: any) {
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

  async updateProduct(id: number, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false }, // Soft delete is safer for e-commerce
    });
  }
}
