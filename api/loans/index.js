import { readDB, writeDB, calculateLoanDetails } from '../_utils.js'

export default async function (req, res) {
  try {
    const db = await readDB()

    if (req.method === 'GET') {
      // Enhance loans with clientName and details
      const enhanced = db.loans.map(loan => {
        const client = db.clients.find(c => c.id === loan.clientId)
        const details = calculateLoanDetails(loan.amount, loan.startDate, loan.paidDate, loan.termDays)
        return { ...loan, clientName: client?.name, ...details, dueDate: details.dueDate.toISOString() }
      })
      return res.status(200).json(enhanced)
    }

    if (req.method === 'POST') {
      const body = await (async () => { try { return await req.json() } catch { return {} } })()
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
      db.loans.push(loan)
      await writeDB(db)
      return res.status(201).json(loan)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).end()
  } catch (err) {
    console.error('loans index error', err)
    return res.status(500).json({ error: String(err?.message || err), stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack })
  }
}
