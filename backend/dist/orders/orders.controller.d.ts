import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(data: any): Promise<{
        items: ({
            product: {
                id: number;
                name: string;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
                isActive: boolean;
                categoryId: number;
                createdAt: Date;
                updatedAt: Date;
            };
            modifiers: ({
                modifier: {
                    id: number;
                    name: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    productId: number;
                    isActive: boolean;
                };
            } & {
                id: number;
                orderItemId: number;
                modifierId: number;
                unitPriceCaptured: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            id: number;
            orderId: number;
            productId: number;
            quantity: number;
            unitPriceCaptured: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
        })[];
    } & {
        id: number;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        customerAddress: string | null;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        paymentStatus: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getOrders(): Promise<({
        items: ({
            product: {
                id: number;
                name: string;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
                isActive: boolean;
                categoryId: number;
                createdAt: Date;
                updatedAt: Date;
            };
            modifiers: ({
                modifier: {
                    id: number;
                    name: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    productId: number;
                    isActive: boolean;
                };
            } & {
                id: number;
                orderItemId: number;
                modifierId: number;
                unitPriceCaptured: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            id: number;
            orderId: number;
            productId: number;
            quantity: number;
            unitPriceCaptured: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
        })[];
    } & {
        id: number;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        customerAddress: string | null;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        paymentStatus: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateOrderStatus(id: number, status: OrderStatus): Promise<{
        id: number;
        orderNumber: string;
        customerName: string;
        customerPhone: string;
        customerAddress: string | null;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryCost: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string | null;
        paymentStatus: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
