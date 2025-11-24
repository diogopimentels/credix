import { readDB, calculateLoanDetails } from './_utils.js'

export default async function (req, res) {
  try {
    const db = await readDB()
    const enhanced = db.loans.map(loan => {
      const client = db.clients.find(c => c.id === loan.clientId)
      const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
      return { ...loan, clientName: client?.name, ...details, dueDate: details.dueDate.toISOString() }
    })
    const alerts = enhanced.filter(l => l.status === 'NEAR_DUE' || l.status === 'LATE')
    return res.status(200).json(alerts)
  } catch (err) {
    console.error('alerts error', err)
    return res.status(500).json({ error: String(err?.message || err), stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack })
  }
}
