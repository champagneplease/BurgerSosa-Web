import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.storeSettings.create({
        data: {}
      });
    }
    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();
    return this.prisma.storeSettings.update({
      where: { id: settings.id },
      data
    });
  }
}
