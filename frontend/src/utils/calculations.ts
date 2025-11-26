import { differenceInCalendarDays, addDays, isAfter, startOfDay } from 'date-fns';

export type LoanStatus = 'ONGOING' | 'NEAR_DUE' | 'DUE' | 'LATE' | 'PAID';
export type LoanStatusPT = 'EM ANDAMENTO' | 'A VENCER' | 'VENCE HOJE' | 'ATRASADO' | 'PAGO';

export interface LoanCalculationResult {
    initialAmount: number;
    interestAmount: number;
    fineAmount: number;
    totalAmount: number;
    daysLate: number;
    status: LoanStatus;
    dueDate: Date;
}

export const LOAN_TERMS = {
    DEFAULT_DAYS: 20,
    INTEREST_RATE: 0.40, // 40%
    DAILY_FINE: 50, // R$ 50.00
};

/**
 * Translate loan status from English to Portuguese
 */
export function translateStatus(status: LoanStatus): LoanStatusPT {
    const translations: Record<LoanStatus, LoanStatusPT> = {
        'ONGOING': 'EM ANDAMENTO',
        'NEAR_DUE': 'A VENCER',
        'DUE': 'VENCE HOJE',
        'LATE': 'ATRASADO',
        'PAID': 'PAGO'
    };
    return translations[status];
}

/**
 * Calculate loan details including status, interest, fines, and totals
 * Business Rules:
 * - Interest (40%): Applied ONLY if paid AFTER due date or currently late
 * - Fine (R$ 50/day): Applied ONLY if paid AFTER due date or currently late
 * - Due date: startDate + termDays
 */
export function calculateLoanDetails(
    amount: number,
    startDate: Date | string,
    paidDate?: Date | string | null,
    customTermDays: number = LOAN_TERMS.DEFAULT_DAYS
): LoanCalculationResult {
    const start = startOfDay(new Date(startDate));
    const due = addDays(start, customTermDays);
    const today = startOfDay(new Date());
    const referenceDate = paidDate ? startOfDay(new Date(paidDate)) : today;

    let status: LoanStatus = 'ONGOING';
    let interestAmount = 0;
    let fineAmount = 0;
    let daysLate = 0;

    // Calculate Status
    if (paidDate) {
        status = 'PAID';
    } else {
        if (isAfter(referenceDate, due)) {
            status = 'LATE';
        } else if (differenceInCalendarDays(due, referenceDate) === 0) {
            status = 'DUE';
        } else if (differenceInCalendarDays(due, referenceDate) <= 3) {
            status = 'NEAR_DUE';
        } else {
            status = 'ONGOING';
        }
    }

    // Calculate Interest and Fines
    // Rule: If paid AFTER due date (day 21+), apply 40% interest + 50 per day late.
    // If paid ON or BEFORE due date, NO interest, NO fine.

    const isLate = isAfter(referenceDate, due);

    if (isLate) {
        daysLate = differenceInCalendarDays(referenceDate, due);
        interestAmount = amount * LOAN_TERMS.INTEREST_RATE;
        fineAmount = daysLate * LOAN_TERMS.DAILY_FINE;
    }

    const totalAmount = amount + interestAmount + fineAmount;

    return {
        initialAmount: amount,
        interestAmount,
        fineAmount,
        totalAmount,
        daysLate,
        status,
        dueDate: due,
    };
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};
