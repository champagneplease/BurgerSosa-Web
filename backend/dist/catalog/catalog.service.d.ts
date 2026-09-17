import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    getFullCatalog(): Promise<({
        products: ({
            modifiers: {
                id: number;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: number;
                isActive: boolean;
            }[];
        } & {
            id: number;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            image: string | null;
            isActive: boolean;
            categoryId: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getAdminCatalog(): Promise<({
        products: ({
            modifiers: {
                id: number;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: number;
                isActive: boolean;
            }[];
        } & {
            id: number;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            image: string | null;
            isActive: boolean;
            categoryId: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createProduct(data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isActive: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProduct(id: number, data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isActive: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        image: string | null;
        isActive: boolean;
        categoryId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
