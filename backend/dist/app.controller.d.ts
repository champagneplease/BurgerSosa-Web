import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    checkHealth(): {
        status: string;
        timestamp: string;
        service: string;
    };
}
