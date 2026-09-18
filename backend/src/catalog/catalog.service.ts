import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Category } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

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

  async createProduct(data: any) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        categoryId: data.categoryId,
        isActive: data.isActive ?? true,
      }
    });

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (category && category.name.toLowerCase().includes('hamburguesa')) {
      await this.prisma.modifier.createMany({
        data: [
          { name: 'Medallón Extra', price: 2000, productId: product.id, isActive: true },
          { name: 'Sin Cebolla', price: 0, productId: product.id, isActive: true }
        ]
      });
    }

    return product;
  }

  async updateProduct(id: number, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number) {
    try {
      // Intentar borrado físico
      await this.prisma.modifier.deleteMany({ where: { productId: id } });
      await this.prisma.recipeItem.deleteMany({ where: { productId: id } });
      
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException('No se puede eliminar este producto porque ya tiene pedidos asociados. Por favor, ocúltalo/páusalo en su lugar.');
      }
      throw error;
    }
  }

  async createCategory(data: any) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      }
    });
  }

  async updateCategory(id: number, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
