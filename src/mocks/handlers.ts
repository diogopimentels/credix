import { http, HttpResponse } from 'msw';
import { calculateLoanDetails } from '../utils/calculations';
import { subDays } from 'date-fns';

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

// Seed Data
const clients: Client[] = Array.from({ length: 30 }, (_, i) => ({
    id: `c-${i + 1}`,
    name: `Cliente Exemplo ${i + 1}`,
    phone: `(11) 99999-${String(i).padStart(4, '0')}`,
    address: `Rua Exemplo, ${i + 100}`,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    notes: 'Cliente confiável',
    createdAt: new Date().toISOString(),
}));

const loans: Loan[] = [
    // Paid
    { id: 'l-1', clientId: 'c-1', amount: 1000, startDate: subDays(new Date(), 25).toISOString(), termDays: 20, paidDate: subDays(new Date(), 2).toISOString(), createdAt: subDays(new Date(), 25).toISOString() },
    { id: 'l-2', clientId: 'c-2', amount: 500, startDate: subDays(new Date(), 10).toISOString(), termDays: 20, paidDate: subDays(new Date(), 5).toISOString(), createdAt: subDays(new Date(), 10).toISOString() },
    { id: 'l-3', clientId: 'c-3', amount: 2000, startDate: subDays(new Date(), 30).toISOString(), termDays: 20, paidDate: subDays(new Date(), 8).toISOString(), createdAt: subDays(new Date(), 30).toISOString() },
    { id: 'l-4', clientId: 'c-4', amount: 1500, startDate: subDays(new Date(), 15).toISOString(), termDays: 20, paidDate: subDays(new Date(), 1).toISOString(), createdAt: subDays(new Date(), 15).toISOString() },

    // Ongoing
    { id: 'l-5', clientId: 'c-5', amount: 3000, startDate: subDays(new Date(), 5).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 5).toISOString() },
    { id: 'l-6', clientId: 'c-6', amount: 1200, startDate: subDays(new Date(), 10).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 10).toISOString() },
    { id: 'l-7', clientId: 'c-7', amount: 800, startDate: subDays(new Date(), 2).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 2).toISOString() },

    // Near Due (<= 3 days left)
    { id: 'l-8', clientId: 'c-8', amount: 5000, startDate: subDays(new Date(), 18).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 18).toISOString() },
    { id: 'l-9', clientId: 'c-9', amount: 2500, startDate: subDays(new Date(), 19).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 19).toISOString() },

    // Late
    { id: 'l-10', clientId: 'c-10', amount: 1000, startDate: subDays(new Date(), 21).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 21).toISOString() }, // 1 day late
    { id: 'l-11', clientId: 'c-11', amount: 1500, startDate: subDays(new Date(), 25).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 25).toISOString() }, // 5 days late
    { id: 'l-12', clientId: 'c-12', amount: 2000, startDate: subDays(new Date(), 32).toISOString(), termDays: 20, paidDate: null, createdAt: subDays(new Date(), 32).toISOString() }, // 12 days late
];

// In-memory storage
let dbClients = [...clients];
let dbLoans = [...loans];

export const handlers = [
    // Clients
    http.get('/api/clients', () => {
        return HttpResponse.json(dbClients);
    }),

    http.post('/api/clients', async ({ request }) => {
        const newClient = await request.json() as Omit<Client, 'id' | 'createdAt'>;
        const client = { ...newClient, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
        dbClients.push(client);
        return HttpResponse.json(client, { status: 201 });
    }),

    http.get('/api/clients/:id', ({ params }) => {
        const client = dbClients.find(c => c.id === params.id);
        if (!client) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(client);
    }),

    // Loans
    http.get('/api/loans', () => {
        // Enhance loans with calculated details
        const enhancedLoans = dbLoans.map(loan => {
            const client = dbClients.find(c => c.id === loan.clientId);
            const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);
            return { ...loan, clientName: client?.name, ...details };
        });
        return HttpResponse.json(enhancedLoans);
    }),

    http.post('/api/loans', async ({ request }) => {
        const newLoan = await request.json() as Omit<Loan, 'id' | 'createdAt' | 'paidDate'>;
        const loan = {
            ...newLoan,
            id: `l-${Date.now()}`,
            createdAt: new Date().toISOString(),
            paidDate: null
        };
        dbLoans.push(loan);
        return HttpResponse.json(loan, { status: 201 });
    }),

    http.get('/api/loans/:id', ({ params }) => {
        const loan = dbLoans.find(l => l.id === params.id);
        if (!loan) return new HttpResponse(null, { status: 404 });
        const client = dbClients.find(c => c.id === loan.clientId);
        const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);
        return HttpResponse.json({ ...loan, client, ...details });
    }),

    http.patch('/api/loans/:id/pay', async ({ params, request }) => {
        const { paidDate } = await request.json() as { paidDate: string };
        const loanIndex = dbLoans.findIndex(l => l.id === params.id);
        if (loanIndex === -1) return new HttpResponse(null, { status: 404 });

        dbLoans[loanIndex] = { ...dbLoans[loanIndex], paidDate };
        return HttpResponse.json(dbLoans[loanIndex]);
    }),

    // Dashboard
    http.get('/api/dashboard', () => {
        // const url = new URL(request.url);
        // const month = url.searchParams.get('month'); // Filter logic if needed

        const enhancedLoans = dbLoans.map(loan => calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays));

        const totalLent = enhancedLoans.reduce((acc, curr) => acc + curr.initialAmount, 0);
        const totalReceived = enhancedLoans.filter(l => l.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalOpen = enhancedLoans.filter(l => l.status !== 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);

        const totalLate = enhancedLoans.filter(l => l.status === 'LATE').reduce((acc, curr) => acc + curr.totalAmount, 0);
        const totalInterest = enhancedLoans.reduce((acc, curr) => acc + curr.interestAmount, 0);
        const totalFines = enhancedLoans.reduce((acc, curr) => acc + curr.fineAmount, 0);

        const recentLoans = dbLoans.slice(-5).map(l => {
            const client = dbClients.find(c => c.id === l.clientId);
            const details = calculateLoanDetails(l.amount, l.startDate, l.paidDate, l.termDays);
            return {
                ...l,
                clientName: client?.name || 'Desconhecido',
                status: details.status,
                dueDate: details.dueDate.toISOString(),
                details: {
                    totalAmount: details.totalAmount
                }
            };
        });

        // Simulated Revenue Data (Last 6 months)
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const revenueChartData = months.map(month => ({
            name: month,
            total: Math.floor(Math.random() * 15000) + 5000
        }));

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
        const enhancedLoans = dbLoans.map(loan => {
            const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays);
            return { ...loan, ...details };
        });

        const alerts = enhancedLoans.filter(l => l.status === 'NEAR_DUE' || l.status === 'LATE');
        return HttpResponse.json(alerts);
    }),
];
