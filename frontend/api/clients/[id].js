import { readDB, writeDB } from '../_utils.js'

export default async function handler(req, res) {
  try {
    const { id } = req.query || {}
    console.log(`[${new Date().toISOString()}] ${req.method} /api/clients/${id}`)
    
    const db = await readDB()
    const idx = db.clients.findIndex(c => c.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Client not found' })

    if (req.method === 'GET') {
      return res.status(200).json(db.clients[idx])
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      db.clients[idx] = { ...db.clients[idx], ...body }
      await writeDB(db)
      return res.status(200).json(db.clients[idx])
    }

    if (req.method === 'DELETE') {
      db.clients.splice(idx, 1)
      await writeDB(db)
      return res.status(204).end()
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[ERROR] /api/clients/[id]:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
