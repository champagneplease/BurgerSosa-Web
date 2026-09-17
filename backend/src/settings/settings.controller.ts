import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateSettings(@Body() updateData: any) {
    return this.settingsService.updateSettings(updateData);
  }
}
