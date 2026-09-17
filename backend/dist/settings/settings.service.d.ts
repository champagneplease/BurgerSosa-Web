import { PrismaService } from '../prisma/prisma.service.js';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: number;
        storeIsOpen: boolean;
        scheduleDays: string;
        openTime: string;
        closeTime: string;
        closedMessage: string;
        whatsappNumber: string;
        deliveryCost: import("@prisma/client/runtime/library.js").Decimal;
        updatedAt: Date;
    }>;
    updateSettings(data: any): Promise<{
        id: number;
        storeIsOpen: boolean;
        scheduleDays: string;
        openTime: string;
        closeTime: string;
        closedMessage: string;
        whatsappNumber: string;
        deliveryCost: import("@prisma/client/runtime/library.js").Decimal;
        updatedAt: Date;
    }>;
}
