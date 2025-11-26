import { LoansRepository } from '../repositories/LoansRepository';

export class ListLoansService {
    constructor(private loansRepository: LoansRepository) { }

    async execute(clientId?: string) {
        if (clientId) {
            return await this.loansRepository.findByClientId(clientId);
        }
        return await this.loansRepository.findAll();
    }
}
