import { CatalogService } from './catalog.service';
export declare class CatalogController {
    private readonly catalogService;
    constructor(catalogService: CatalogService);
    getCatalog(): Promise<({
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
    createCategory(data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCategory(id: number, data: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
