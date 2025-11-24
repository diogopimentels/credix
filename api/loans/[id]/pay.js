import { readDB, writeDB } from '../../_utils.js'

export default async function handler(req, res) {
  try {
    const { id } = req.query || {}
    console.log(`[${new Date().toISOString()}] ${req.method} /api/loans/${id}/pay`)
    
    if (req.method !== 'PATCH') {
      res.setHeader('Allow', 'PATCH')
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
    
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const db = await readDB()
    const idx = db.loans.findIndex(l => l.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Loan not found' })
    
    console.log('Marking loan as paid:', id)
    db.loans[idx] = { ...db.loans[idx], paidDate: body.paidDate }
    await writeDB(db)
    console.log('Loan marked as paid')
    return res.status(200).json(db.loans[idx])
  } catch (err) {
    console.error('[ERROR] /api/loans/[id]/pay:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
