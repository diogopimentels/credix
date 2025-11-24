import { subDays, addDays, isAfter, startOfDay, differenceInCalendarDays } from 'date-fns'

const LOAN_TERMS = {
    DEFAULT_DAYS: 20,
    INTEREST_RATE: 0.40,
    DAILY_FINE: 50,
}

function calculateLoanDetails(amount, startDate, paidDate, customTermDays = LOAN_TERMS.DEFAULT_DAYS) {
    const start = startOfDay(new Date(startDate))
    const due = addDays(start, customTermDays)
    const today = startOfDay(new Date())
    const referenceDate = paidDate ? startOfDay(new Date(paidDate)) : today

    let status = 'ONGOING'
    let interestAmount = 0
    let fineAmount = 0
    let daysLate = 0

    if (paidDate) {
        status = 'PAID'
    } else {
        if (isAfter(referenceDate, due)) {
            status = 'LATE'
        } else if (differenceInCalendarDays(due, referenceDate) === 0) {
            status = 'DUE'
        } else if (differenceInCalendarDays(due, referenceDate) <= 3) {
            status = 'NEAR_DUE'
        } else {
            status = 'ONGOING'
        }
    }

    const isLate = isAfter(referenceDate, due)
    if (isLate) {
        daysLate = differenceInCalendarDays(referenceDate, due)
        interestAmount = amount * LOAN_TERMS.INTEREST_RATE
        fineAmount = daysLate * LOAN_TERMS.DAILY_FINE
    }

    const totalAmount = amount + interestAmount + fineAmount

    return {
        initialAmount: amount,
        interestAmount,
        fineAmount,
        totalAmount,
        daysLate,
        status,
        dueDate: due,
    }
}

// Seed data (small subset - mirrors mocks)
const clients = Array.from({ length: 12 }, (_, i) => ({
    id: `c-${i + 1}`,
    name: `Cliente Exemplo ${i + 1}`,
}))

const loans = [
    { id: 'l-1', clientId: 'c-1', amount: 1000, startDate: subDays(new Date(), 25).toISOString(), termDays: 20, paidDate: subDays(new Date(), 2).toISOString() },
    { id: 'l-5', clientId: 'c-5', amount: 3000, startDate: subDays(new Date(), 5).toISOString(), termDays: 20, paidDate: null },
    { id: 'l-10', clientId: 'c-10', amount: 1000, startDate: subDays(new Date(), 21).toISOString(), termDays: 20, paidDate: null },
]

export default function (req, res) {
    try {
        const enhancedLoans = loans.map(loan => {
            const client = clients.find(c => c.id === loan.clientId)
            const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
            return { ...loan, clientName: client?.name || 'Desconhecido', ...details, dueDate: details.dueDate.toISOString() }
        })

        const totalLent = enhancedLoans.reduce((acc, curr) => acc + curr.initialAmount, 0)
        const totalReceived = enhancedLoans.filter(l => l.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0)
        const totalOpen = enhancedLoans.filter(l => l.status !== 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0)
        const totalLate = enhancedLoans.filter(l => l.status === 'LATE').reduce((acc, curr) => acc + curr.totalAmount, 0)
        const totalInterest = enhancedLoans.reduce((acc, curr) => acc + curr.interestAmount, 0)
        const totalFines = enhancedLoans.reduce((acc, curr) => acc + curr.fineAmount, 0)

        const recentLoans = loans.slice(-5).map(l => {
            const client = clients.find(c => c.id === l.clientId)
            const details = calculateLoanDetails(l.amount, l.startDate, l.paidDate, l.termDays)
            return {
                ...l,
                clientName: client?.name || 'Desconhecido',
                status: details.status,
                dueDate: details.dueDate.toISOString(),
                details: { totalAmount: details.totalAmount }
            }
        })

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
        const revenueChartData = months.map(month => ({ name: month, total: Math.floor(Math.random() * 15000) + 5000 }))

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send(JSON.stringify({
            totalLent,
            totalReceived,
            totalOpen,
            totalLate,
            totalInterest,
            totalFines,
            recentLoans,
            revenueChartData
        }))
    } catch (err) {
        console.error('dashboard api error', err)
        return res.status(500).json({ error: String(err?.message || err), stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack })
    }
}
