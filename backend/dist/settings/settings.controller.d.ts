import { SettingsService } from './settings.service.js';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    updateSettings(updateData: any): Promise<{
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
