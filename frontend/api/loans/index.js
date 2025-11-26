import { readDB, writeDB, calculateLoanDetails } from '../_utils.js'

export default async function handler(req, res) {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} /api/loans`)
    const db = await readDB()

    if (req.method === 'GET') {
      console.log('GET /api/loans - reading loans')
      // Enhance loans with clientName and details
      const enhanced = db.loans.map(loan => {
        const client = db.clients.find(c => c.id === loan.clientId)
        const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
        return { ...loan, clientName: client?.name, ...details, dueDate: details.dueDate.toISOString() }
      })
      console.log(`Found ${enhanced.length} loans`)
      return res.status(200).json(enhanced)
    }

    if (req.method === 'POST') {
      console.log('POST /api/loans - creating loan')
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      console.log('Request body:', body)
      
      const now = new Date().toISOString()
      const loan = {
        id: `l-${Date.now()}`,
        clientId: body.clientId,
        amount: Number(body.amount) || 0,
        startDate: body.startDate || now,
        termDays: Number(body.termDays) || 20,
        paidDate: null,
        createdAt: now,
      }
      console.log('Creating loan:', loan)
      db.loans.push(loan)
      await writeDB(db)
      console.log('Loan saved successfully')
      return res.status(201).json(loan)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[ERROR] /api/loans:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
