import { readDB, calculateLoanDetails } from './_utils.js'

export default async function handler(req, res) {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} /api/alerts`)
    
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
    
    const db = await readDB()
    const enhanced = db.loans.map(loan => {
      const client = db.clients.find(c => c.id === loan.clientId)
      const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
      return { ...loan, clientName: client?.name, ...details, dueDate: details.dueDate.toISOString() }
    })
    const alerts = enhanced.filter(l => l.status === 'NEAR_DUE' || l.status === 'LATE')
    console.log(`Found ${alerts.length} alerts`)
    return res.status(200).json(alerts)
  } catch (err) {
    console.error('[ERROR] /api/alerts:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
