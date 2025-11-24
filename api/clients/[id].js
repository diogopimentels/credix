import { readDB, writeDB } from '../_utils.js'

export default async function (req, res) {
  try {
    const { id } = req.query || {};
    const db = await readDB()
    const idx = db.clients.findIndex(c => c.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Client not found' })

    if (req.method === 'GET') {
      return res.status(200).json(db.clients[idx])
    }

    if (req.method === 'PATCH') {
      const body = await (async () => { try { return await req.json() } catch { return {} } })()
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
    return res.status(405).end()
  } catch (err) {
    console.error('clients id error', err)
    return res.status(500).send(String(err && err.stack ? err.stack : err))
  }
}
