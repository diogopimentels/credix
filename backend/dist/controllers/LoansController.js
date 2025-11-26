"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansController = void 0;
const schemas_1 = require("../schemas");
class LoansController {
    constructor(loansService) {
        this.loansService = loansService;
    }
    async create(request, response) {
        const data = schemas_1.createLoanSchema.parse(request.body);
        const loan = await this.loansService.create(data);
        return response.status(201).json(loan);
    }
    async index(request, response) {
        const loans = await this.loansService.findAll();
        return response.json(loans);
    }
    async show(request, response) {
        const { id } = request.params;
        const loan = await this.loansService.findById(id);
        return response.json(loan);
    }
    async addPayment(request, response) {
        const { id } = request.params;
        const data = schemas_1.addPaymentSchema.parse(request.body);
        const payment = await this.loansService.addPayment(id, data);
        return response.status(201).json(payment);
    }
}
exports.LoansController = LoansController;
