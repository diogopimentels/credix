import { readDB, writeDB } from '../_utils.js'
import { v4 as uuidv4 } from 'uuid'

export default async function (req, res) {
  try {
    if (req.method === 'GET') {
      const db = await readDB()
      return res.status(200).json(db.clients)
    }

    if (req.method === 'POST') {
      const body = await (async () => {
        try { return await req.json() } catch { return {} }
      })()
      const db = await readDB()
      const now = new Date().toISOString()
      const client = {
        id: `c-${Date.now()}`,
        name: body.name || 'Novo Cliente',
        phone: body.phone || '',
        address: body.address || '',
        photo: body.photo || '',
        notes: body.notes || '',
        createdAt: now,
      }
      db.clients.push(client)
      await writeDB(db)
      return res.status(201).json(client)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).end()
  } catch (err) {
    console.error('clients index error', err)
    return res.status(500).send(String(err && err.stack ? err.stack : err))
  }
}
