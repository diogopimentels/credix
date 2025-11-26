"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async index(request, response) {
        const metrics = await this.dashboardService.getMetrics();
        return response.json(metrics);
    }
}
exports.DashboardController = DashboardController;
