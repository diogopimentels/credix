import { Request, Response } from 'express';
import { DashboardRepository } from '../repositories/DashboardRepository';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
    async index(request: Request, response: Response) {
        const dashboardRepository = new DashboardRepository();
        const dashboardService = new DashboardService(dashboardRepository);

        const summary = await dashboardService.execute();

        return response.json(summary);
    }
}
