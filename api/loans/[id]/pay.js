import { readDB, writeDB } from '../../_utils.js'

export default async function (req, res) {
  try {
    const { id } = req.query || {}
    if (req.method !== 'PATCH') return res.status(405).end()
    const body = await (async () => { try { return await req.json() } catch { return {} } })()
    const db = await readDB()
    const idx = db.loans.findIndex(l => l.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Loan not found' })
    db.loans[idx] = { ...db.loans[idx], paidDate: body.paidDate }
    await writeDB(db)
    return res.status(200).json(db.loans[idx])
  } catch (err) {
    console.error('loan pay error', err)
    return res.status(500).send(String(err && err.stack ? err.stack : err))
  }
}
