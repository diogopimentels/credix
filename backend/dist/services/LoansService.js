"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansService = void 0;
const AppError_1 = require("../utils/AppError");
const date_fns_1 = require("date-fns");
class LoansService {
    constructor(loansRepository, clientsRepository) {
        this.loansRepository = loansRepository;
        this.clientsRepository = clientsRepository;
    }
    async create({ clientId, principal, dueDate }) {
        const client = await this.clientsRepository.findById(clientId);
        if (!client) {
            throw new AppError_1.AppError('Client not found', 404);
        }
        // Calculate interest (40%)
        const interestRate = 40;
        const totalAmount = principal * (1 + interestRate / 100);
        // Handle date format
        const parsedDueDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
        const loan = await this.loansRepository.create({
            client: { connect: { id: clientId } },
            principal,
            interestRate,
            totalAmount,
            dueDate: parsedDueDate,
            status: 'open',
        });
        return loan;
    }
    async findAll() {
        const loans = await this.loansRepository.findAll();
        // Update status dynamically if needed (e.g. check for late loans)
        const now = new Date();
        const loansWithStatus = loans.map(loan => {
            let status = loan.status;
            if (status === 'open' && (0, date_fns_1.isAfter)(now, loan.dueDate)) {
                status = 'late';
            }
            return { ...loan, status };
        });
        return loansWithStatus;
    }
    async findById(id) {
        const loan = await this.loansRepository.findById(id);
        if (!loan) {
            throw new AppError_1.AppError('Loan not found', 404);
        }
        return loan;
    }
    async addPayment(loanId, { amount }) {
        const loan = await this.loansRepository.findById(loanId);
        if (!loan) {
            throw new AppError_1.AppError('Loan not found', 404);
        }
        if (loan.status === 'paid') {
            throw new AppError_1.AppError('Loan is already paid');
        }
        const payment = await this.loansRepository.addPayment({
            loan: { connect: { id: loanId } },
            amount,
        });
        // Check if fully paid
        const totalPaid = loan.payments.reduce((acc, curr) => acc + Number(curr.amount), 0) + amount;
        if (totalPaid >= Number(loan.totalAmount)) {
            await this.loansRepository.updateStatus(loanId, 'paid');
        }
        return payment;
    }
}
exports.LoansService = LoansService;
