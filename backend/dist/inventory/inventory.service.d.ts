import { PrismaService } from '../prisma/prisma.service';
import { MovementType } from '@prisma/client';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getIngredients(): Promise<{
        id: number;
        name: string;
        unit: string;
        currentStock: number;
        minStock: number;
        isActive: boolean;
    }[]>;
    createIngredient(data: any): Promise<{
        id: number;
        name: string;
        unit: string;
        currentStock: number;
        minStock: number;
        isActive: boolean;
    }>;
    updateIngredient(id: number, data: any): Promise<{
        id: number;
        name: string;
        unit: string;
        currentStock: number;
        minStock: number;
        isActive: boolean;
    }>;
    deleteIngredient(id: number): Promise<{
        id: number;
        name: string;
        unit: string;
        currentStock: number;
        minStock: number;
        isActive: boolean;
    }>;
    recordMovement(data: {
        ingredientId: number;
        quantity: number;
        type: MovementType;
        reason?: string;
        userId?: number;
        referenceId?: number;
    }): Promise<{
        id: number;
        ingredientId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.MovementType;
        reason: string | null;
        userId: number | null;
        referenceId: number | null;
        createdAt: Date;
    }>;
    getMovements(ingredientId?: number): Promise<({
        user: {
            id: number;
            email: string;
            password: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        ingredient: {
            id: number;
            name: string;
            unit: string;
            currentStock: number;
            minStock: number;
            isActive: boolean;
        };
    } & {
        id: number;
        ingredientId: number;
        quantity: number;
        type: import(".prisma/client").$Enums.MovementType;
        reason: string | null;
        userId: number | null;
        referenceId: number | null;
        createdAt: Date;
    })[]>;
}
