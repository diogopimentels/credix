import { readDB, writeDB } from '../_utils.js'

export default async function handler(req, res) {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} /api/clients`)
    
    if (req.method === 'GET') {
      console.log('GET /api/clients - reading clients')
      const db = await readDB()
      console.log(`Found ${db.clients.length} clients`)
      return res.status(200).json(db.clients)
    }

    if (req.method === 'POST') {
      console.log('POST /api/clients - creating client')
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
      console.log('Request body:', body)
      
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
      
      console.log('Creating client:', client)
      db.clients.push(client)
      await writeDB(db)
      console.log('Client saved successfully')
      
      return res.status(201).json(client)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[ERROR] /api/clients:', err)
    return res.status(500).json({ 
      error: String(err?.message || err),
      details: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err?.stack 
    })
  }
}
