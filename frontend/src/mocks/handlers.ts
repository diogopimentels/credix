import { http, HttpResponse } from 'msw';
import { calculateLoanDetails, LoanStatus } from '../utils/calculations';

export interface Client {
    id: string;
    name: string;
    phone: string;
    address: string;
    photo: string; // base64 or url
    notes: string;
    createdAt: string;
}

export interface Loan {
    id: string;
    clientId: string;
    amount: number;
    startDate: string;
    termDays: number;
    paidDate: string | null;
    createdAt: string;
}

export interface EnhancedLoan extends Loan {
    clientName?: string
    clientPhone?: string
    status: LoanStatus
    totalAmount: number
    interestAmount: number
    fineAmount: number
    dueDate: string
}

// LocalStorage Key
const DB_KEY = 'credimestre-db';

// Database Structure
interface Database {
    clients: Client[];
    loans: Loan[];
}

// Helper: Get database from localStorage
function getDb(): Database {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }

    // Initialize with empty arrays if nothing exists
    return {
        clients: [],
        loans: []
    };
}

// Helper: Save database to localStorage
function saveDb(db: Database): void {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Helper: Translate status to Portuguese
function translateStatus(status: LoanStatus): string {
    const translations: Record<LoanStatus, string> = {
        'ONGOING': 'EM ANDAMENTO',
        'NEAR_DUE': 'A VENCER',
        'DUE': 'VENCE HOJE',
        'LATE': 'ATRASADO',
        'PAID': 'PAGO'
    };
    return translations[status] || status;
}

export const handlers = [
    // Clients
    http.get('/api/clients', () => {
        const db = getDb();
        return HttpResponse.json(db.clients);
    }),

    http.post('/api/clients', async ({ request }) => {
        const newClient = await request.json() as Omit<Client, 'id' | 'createdAt'>;
        const client: Client = {
            ...newClient,
            id: `c-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        const db = getDb();
        db.clients.push(client);
        saveDb(db);

        return HttpResponse.json(client, { status: 201 });
    }),

    http.get('/api/clients/:id', ({ params }) => {
        const db = getDb();
        const client = db.clients.find(c => c.id === params.id);
        if (!client) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(client);
    }),

    http.patch('/api/clients/:id', async ({ params, request }) => {
        const updates = await request.json() as Partial<Client>;
        const db = getDb();
        const clientIndex = db.clients.findIndex(c => c.id === params.id);
        if (clientIndex === -1) return new HttpResponse(null, { status: 404 });

        db.clients[clientIndex] = { ...db.clients[clientIndex], ...updates };
        saveDb(db);

        return HttpResponse.json(db.clients[clientIndex]);
    }),

    http.delete('/api/clients/:id', ({ params }) => {
        const db = getDb();
        const clientIndex = db.clients.findIndex(c => c.id === params.id);
        if (clientIndex === -1) return new HttpResponse(null, { status: 404 });

        db.clients.splice(clientIndex, 1);
        saveDb(db);

        return new HttpResponse(null, { status: 204 });
    }),

    // Loans
    http.get('/api/loans', () => {
        const db = getDb();

        // Enhance loans with calculated details (dynamic based on current date)
        const enhancedLoans = db.loans.map(loan => {
            const client = db.clients.find(c => c.id === loan.clientId);
            const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);

            return {
                ...loan,
                clientName: client?.name,
                clientPhone: client?.phone,
                ...details,
                // Translate status to Portuguese
                status: translateStatus(details.status) as any
            };
        });

        return HttpResponse.json(enhancedLoans);
    }),

    http.post('/api/loans', async ({ request }) => {
        const newLoan = await request.json() as Omit<Loan, 'id' | 'createdAt' | 'paidDate'>;
        const loan: Loan = {
            ...newLoan,
            id: `l-${Date.now()}`,
            createdAt: new Date().toISOString(),
            paidDate: null
        };

        const db = getDb();
        db.loans.push(loan);
        saveDb(db);

        return HttpResponse.json(loan, { status: 201 });
    }),

    http.get('/api/loans/:id', ({ params }) => {
        const db = getDb();
        const loan = db.loans.find(l => l.id === params.id);
        if (!loan) return new HttpResponse(null, { status: 404 });

        const client = db.clients.find(c => c.id === loan.clientId);
        const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);

        return HttpResponse.json({
            ...loan,
            client,
            clientPhone: client?.phone,
            ...details,
            // Translate status to Portuguese
            status: translateStatus(details.status) as any
        });
    }),

    http.patch('/api/loans/:id', async ({ params, request }) => {
        const updates = await request.json() as Partial<Loan>;
        const db = getDb();
        const loanIndex = db.loans.findIndex(l => l.id === params.id);
        if (loanIndex === -1) return new HttpResponse(null, { status: 404 });

        db.loans[loanIndex] = { ...db.loans[loanIndex], ...updates };
        saveDb(db);

        return HttpResponse.json(db.loans[loanIndex]);
    }),

    http.delete('/api/loans/:id', ({ params }) => {
        const db = getDb();
        const loanIndex = db.loans.findIndex(l => l.id === params.id);
        if (loanIndex === -1) return new HttpResponse(null, { status: 404 });

        db.loans.splice(loanIndex, 1);
        saveDb(db);

        return new HttpResponse(null, { status: 204 });
    }),

    http.patch('/api/loans/:id/pay', async ({ params, request }) => {
        const { paidDate } = await request.json() as { paidDate: string };
        const db = getDb();
        const loanIndex = db.loans.findIndex(l => l.id === params.id);
        if (loanIndex === -1) return new HttpResponse(null, { status: 404 });

        db.loans[loanIndex] = { ...db.loans[loanIndex], paidDate };
        saveDb(db);

        return HttpResponse.json(db.loans[loanIndex]);
    }),

    // Dashboard
    http.get('/api/dashboard', () => {
        const db = getDb();

        // Calculate details for all loans dynamically
        const enhancedLoans = db.loans.map(loan => calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays));

        const totalLent = enhancedLoans.reduce((acc, curr) => acc + curr.initialAmount, 0);
        const totalReceived = enhancedLoans.filter(l => l.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalOpen = enhancedLoans.filter(l => l.status !== 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);

        const totalLate = enhancedLoans.filter(l => l.status === 'LATE').reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalInterest = enhancedLoans.reduce((acc, curr) => acc + curr.interestAmount, 0);
        const totalFines = enhancedLoans.reduce((acc, curr) => acc + curr.fineAmount, 0);

        const recentLoans = db.loans.slice(-5).map(l => {
            const client = db.clients.find(c => c.id === l.clientId);
            const details = calculateLoanDetails(l.amount, l.startDate, l.paidDate, l.termDays);
            return {
                ...l,
                clientName: client?.name || 'Desconhecido',
                clientPhone: client?.phone,
                // Translate status to Portuguese
                status: translateStatus(details.status),
                dueDate: details.dueDate.toISOString(),
                details: {
                    totalAmount: details.totalAmount
                }
            };
        });

        // Calculate Revenue Data from actual paid loans (Last 6 months)
        const today = new Date();
        const revenueChartData = [];

        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
            const monthYear = monthDate.getMonth();
            const year = monthDate.getFullYear();

            // Calculate total revenue for this month (sum of paid loans in this month)
            const monthRevenue = db.loans
                .filter(loan => {
                    if (!loan.paidDate) return false;
                    const paidDate = new Date(loan.paidDate);
                    return paidDate.getMonth() === monthYear && paidDate.getFullYear() === year;
                })
                .reduce((acc, loan) => {
                    const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);
                    return acc + details.totalAmount;
                }, 0);

            revenueChartData.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Capitalize first letter
                total: monthRevenue
            });
        }


        return HttpResponse.json({
            totalLent,
            totalReceived,
            totalOpen,
            totalLate,
            totalInterest,
            totalFines,
            recentLoans,
            revenueChartData
        });
    }),

    // Alerts
    http.get('/api/alerts', () => {
        const db = getDb();

        const enhancedLoans = db.loans.map(loan => {
            const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);
            return {
                ...loan,
                ...details,
                // Translate status to Portuguese
                status: translateStatus(details.status) as any
            };
        });

        // Filter for NEAR_DUE and LATE using English enum values for filtering
        const alerts = enhancedLoans.filter(l => {
            const details = calculateLoanDetails(l.amount, l.startDate, l.paidDate, l.termDays);
            return details.status === 'NEAR_DUE' || details.status === 'LATE';
        });

        return HttpResponse.json(alerts);
    }),
];
