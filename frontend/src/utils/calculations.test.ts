import { describe, it, expect } from 'vitest';
import { calculateLoanDetails, LOAN_TERMS } from './calculations';
import { addDays, subDays } from 'date-fns';

describe('calculateLoanDetails', () => {
    it('should return initial amount and no interest if paid on time', () => {
        const amount = 1000;
        const startDate = new Date();
        const result = calculateLoanDetails(amount, startDate, addDays(startDate, 5));

        expect(result.initialAmount).toBe(1000);
        expect(result.interestAmount).toBe(0);
        expect(result.fineAmount).toBe(0);
        expect(result.totalAmount).toBe(1000);
        expect(result.status).toBe('PAID');
    });

    it('should return initial amount and no interest if ongoing and not due', () => {
        const amount = 1000;
        const startDate = new Date();
        const result = calculateLoanDetails(amount, startDate);

        expect(result.initialAmount).toBe(1000);
        expect(result.interestAmount).toBe(0);
        expect(result.fineAmount).toBe(0);
        expect(result.totalAmount).toBe(1000);
        expect(result.status).toBe('ONGOING');
    });

    it('should apply interest and fines if late (1 day)', () => {
        const amount = 1000;
        const startDate = subDays(new Date(), 21); // 21 days ago (term is 20) -> 1 day late
        const result = calculateLoanDetails(amount, startDate);

        expect(result.status).toBe('LATE');
        expect(result.daysLate).toBe(1);
        expect(result.interestAmount).toBe(amount * LOAN_TERMS.INTEREST_RATE); // 400
        expect(result.fineAmount).toBe(1 * LOAN_TERMS.DAILY_FINE); // 50
        expect(result.totalAmount).toBe(1000 + 400 + 50);
    });

    it('should apply interest and fines if late (5 days)', () => {
        const amount = 1000;
        const startDate = subDays(new Date(), 25); // 25 days ago -> 5 days late
        const result = calculateLoanDetails(amount, startDate);

        expect(result.status).toBe('LATE');
        expect(result.daysLate).toBe(5);
        expect(result.interestAmount).toBe(amount * LOAN_TERMS.INTEREST_RATE); // 400
        expect(result.fineAmount).toBe(5 * LOAN_TERMS.DAILY_FINE); // 250
        expect(result.totalAmount).toBe(1000 + 400 + 250);
    });

    it('should identify NEAR_DUE status', () => {
        const amount = 1000;
        const startDate = subDays(new Date(), 18); // 18 days ago -> 2 days left
        const result = calculateLoanDetails(amount, startDate);

        expect(result.status).toBe('NEAR_DUE');
    });
});
