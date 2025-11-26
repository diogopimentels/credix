"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
class DashboardService {
    constructor(loansRepository) {
        this.loansRepository = loansRepository;
    }
    async getMetrics() {
        const metrics = await this.loansRepository.getDashboardMetrics();
        const loans = await this.loansRepository.findAll();
        let totalReceivable = 0;
        loans.forEach(loan => {
            if (loan.status !== 'paid') {
                const totalPaid = loan.payments.reduce((acc, curr) => acc + Number(curr.amount), 0);
                const remaining = Number(loan.totalAmount) - totalPaid;
                totalReceivable += remaining > 0 ? remaining : 0;
            }
        });
        return {
            ...metrics,
            totalReceivable,
        };
    }
}
exports.DashboardService = DashboardService;
