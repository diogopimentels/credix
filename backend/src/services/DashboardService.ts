import { LoansRepository } from '../repositories/LoansRepository';

export class DashboardService {
    constructor(private loansRepository: LoansRepository) { }

    async getMetrics() {
        const metrics = await this.loansRepository.getDashboardMetrics();

        const loans = await this.loansRepository.findAll();

        let totalReceivable = 0;

        loans.forEach(loan => {
            if (loan.status !== 'paid') {
                const totalPaid = loan.payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
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
