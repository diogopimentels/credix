import { readDB, writeDB, calculateLoanDetails } from '../_utils.js'

export default async function (req, res) {
  try {
    const { id } = req.query || {}
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
      const body = await (async () => { try { return await req.json() } catch { return {} } })()
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
    return res.status(405).end()
  } catch (err) {
    console.error('loans id error', err)
    return res.status(500).send(String(err && err.stack ? err.stack : err))
  }
}
