export interface Client {
    id: number
    name: string
    email: string
    cpf: string
    phone: string
    address: string
    status: 'active' | 'inactive'
    createdAt: string
}

export interface Loan {
    id: number
    clientId: number
    amount: number
    interestRate: number
    totalAmount: number
    installments: number
    status: 'active' | 'paid' | 'late'
    startDate: string
    dueDate: string
    createdAt: string
}

const STORAGE_KEY = 'credix_mock_db'

interface DBData {
    clients: Client[]
    loans: Loan[]
}

const INITIAL_DATA: DBData = {
    clients: [],
    loans: [],
}

class MockDBService {
    private data: DBData

    constructor() {
        this.data = this.load()
    }

    private load(): DBData {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
        return { ...INITIAL_DATA }
    }

    private save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    }

    reset() {
        this.data = { ...INITIAL_DATA }
        this.save()
    }

    // Clients
    getClients() {
        return [...this.data.clients]
    }

    getClient(id: number) {
        return this.data.clients.find((c) => c.id === id)
    }

    addClient(client: Omit<Client, 'id' | 'createdAt'>) {
        const newClient: Client = {
            ...client,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        }
        this.data.clients.push(newClient)
        this.save()
        return newClient
    }

    updateClient(id: number, updates: Partial<Client>) {
        const index = this.data.clients.findIndex((c) => c.id === id)
        if (index !== -1) {
            this.data.clients[index] = { ...this.data.clients[index], ...updates }
            this.save()
            return this.data.clients[index]
        }
        return null
    }

    deleteClient(id: number) {
        this.data.clients = this.data.clients.filter((c) => c.id !== id)
        // Also delete related loans? For now, let's keep it simple or cascade delete
        this.data.loans = this.data.loans.filter((l) => l.clientId !== id)
        this.save()
    }

    // Loans
    getLoans() {
        // Join with client name for display if needed, but the UI might handle that.
        // Let's return the raw loans.
        return [...this.data.loans].map(loan => {
            const client = this.data.clients.find(c => c.id === loan.clientId)
            return { ...loan, clientName: client?.name || 'Unknown' }
        })
    }

    getLoansByClient(clientId: number) {
        return this.data.loans.filter(l => l.clientId === clientId)
    }

    addLoan(loan: Omit<Loan, 'id' | 'createdAt' | 'status'>) {
        const newLoan: Loan = {
            ...loan,
            id: Date.now(),
            status: 'active',
            createdAt: new Date().toISOString(),
        }
        this.data.loans.push(newLoan)
        this.save()
        return newLoan
    }

    payLoan(id: number) {
        const index = this.data.loans.findIndex(l => l.id === id)
        if (index !== -1) {
            this.data.loans[index].status = 'paid'
            this.save()
            return this.data.loans[index]
        }
        return null
    }

    // Dashboard Stats
    getStats() {
        const totalLoans = this.data.loans.length
        const activeLoans = this.data.loans.filter((l) => l.status === 'active').length
        const totalClients = this.data.clients.length

        const totalLent = this.data.loans.reduce((acc, curr) => acc + curr.amount, 0)
        const totalReceivable = this.data.loans.reduce((acc, curr) => acc + curr.totalAmount, 0)
        // Simple profit calc
        const totalProfit = totalReceivable - totalLent

        return {
            totalLoans,
            activeLoans,
            totalClients,
            totalLent,
            totalReceivable,
            totalProfit
        }
    }
}

export const mockDB = new MockDBService()
