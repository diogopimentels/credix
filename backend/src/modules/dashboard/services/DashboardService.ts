import { DashboardRepository } from '../repositories/DashboardRepository';

export class DashboardService {
    constructor(private dashboardRepository: DashboardRepository) { }

    async execute() {
        const summary = await this.dashboardRepository.getSummary();
        return summary;
    }
}
