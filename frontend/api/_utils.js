import { addDays, isAfter, startOfDay, differenceInCalendarDays } from 'date-fns'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const DB_PATH = path.resolve(__dirname, '..', 'data', 'db.json')

// Default seed data
const DEFAULT_DB = {
  clients: [
    { id: 'c-1', name: 'Cliente Exemplo 1', phone: '(11) 99999-0001', address: 'Rua Exemplo, 101', photo: '', notes: 'Cliente confiável', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 'c-2', name: 'Cliente Exemplo 2', phone: '(11) 99999-0002', address: 'Rua Exemplo, 102', photo: '', notes: '', createdAt: '2025-01-02T00:00:00.000Z' },
    { id: 'c-3', name: 'Cliente Exemplo 3', phone: '(11) 99999-0003', address: 'Rua Exemplo, 103', photo: '', notes: '', createdAt: '2025-01-03T00:00:00.000Z' }
  ],
  loans: [
    { id: 'l-1', clientId: 'c-1', amount: 1000, startDate: '2025-10-30T00:00:00.000Z', termDays: 20, paidDate: null, createdAt: '2025-10-30T00:00:00.000Z' },
    { id: 'l-2', clientId: 'c-2', amount: 500, startDate: '2025-11-14T00:00:00.000Z', termDays: 20, paidDate: null, createdAt: '2025-11-14T00:00:00.000Z' }
  ]
}

// Module-level singleton for in-memory cache
let dbCache = null
let dbLoaded = false

async function initDB() {
  if (dbLoaded) return dbCache

  try {
    console.log('Attempting to read db.json from:', DB_PATH)
    const txt = await fs.readFile(DB_PATH, 'utf8')
    dbCache = JSON.parse(txt)
    console.log('Successfully loaded db.json')
  } catch (err) {
    console.warn('Using default seed data:', err.message)
    dbCache = JSON.parse(JSON.stringify(DEFAULT_DB))
  }

  dbLoaded = true
  return dbCache
}

export async function readDB() {
  if (!dbLoaded) {
    await initDB()
  }
  // Return a deep copy to avoid external mutations
  return JSON.parse(JSON.stringify(dbCache))
}

export async function writeDB(data) {
  // Update in-memory cache
  dbCache = JSON.parse(JSON.stringify(data))

  // Try to persist to file (works locally, fails silently on Vercel)
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
    console.log('Successfully wrote to db.json')
  } catch (err) {
    console.warn('Could not persist to db.json (normal on Vercel):', err.message)
  }
}

export const LOAN_TERMS = {
  DEFAULT_DAYS: 20,
  INTEREST_RATE: 0.40,
  DAILY_FINE: 50,
}

export function calculateLoanDetails(amount, startDate, paidDate, customTermDays = LOAN_TERMS.DEFAULT_DAYS) {
  const start = startOfDay(new Date(startDate))
  const due = addDays(start, customTermDays)
  const today = startOfDay(new Date())
  const referenceDate = paidDate ? startOfDay(new Date(paidDate)) : today

  let status = 'ONGOING'
  let interestAmount = 0
  let fineAmount = 0
  let daysLate = 0

  if (paidDate) {
    status = 'PAID'
  } else {
    if (isAfter(referenceDate, due)) {
      status = 'LATE'
    } else if (differenceInCalendarDays(due, referenceDate) === 0) {
      status = 'DUE'
    } else if (differenceInCalendarDays(due, referenceDate) <= 3) {
      status = 'NEAR_DUE'
    } else {
      status = 'ONGOING'
    }
  }

  const isLate = isAfter(referenceDate, due)
  if (isLate) {
    daysLate = differenceInCalendarDays(referenceDate, due)
    interestAmount = amount * LOAN_TERMS.INTEREST_RATE
    fineAmount = daysLate * LOAN_TERMS.DAILY_FINE
  }

  return {
    initialAmount: amount,
    interestAmount,
    fineAmount,
    totalAmount: amount + interestAmount + fineAmount,
    daysLate,
    status,
    dueDate: due,
  }
}
