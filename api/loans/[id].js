import { readDB, writeDB, calculateLoanDetails } from '../_utils.js'

export default async function handler(req, res) {
  try {
    const { id } = req.query || {}
    console.log(`[${new Date().toISOString()}] ${req.method} /api/loans/${id}`)
    
    const db = await readDB()
    const idx = db.loans.findIndex(l => l.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Loan not found' })

    const loan = db.loans[idx]

    if (req.method === 'GET') {
      const client = db.clients.find(c => c.id === loan.clientId)
      const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
      return res.status(200).json({ ...loan, client, ...details, dueDate: details.dueDate.toISOString() })
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      db.loans[idx] = { ...db.loans[idx], ...body }
      await writeDB(db)
      return res.status(200).json(db.loans[idx])
    }

    if (req.method === 'DELETE') {
      db.loans.splice(idx, 1)
      await writeDB(db)
      return res.status(204).end()
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[ERROR] /api/loans/[id]:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
