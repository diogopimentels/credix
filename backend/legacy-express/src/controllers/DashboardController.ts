import { Request, Response } from 'express';
import { DashboardService } from '../../src/services/DashboardService';

export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    async totals(request: Request, response: Response) {
        const data = await this.dashboardService.totals();
        return response.json(data);
    }
}
