import { addDays, isAfter, startOfDay, differenceInCalendarDays } from 'date-fns'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const DB_PATH = path.resolve(__dirname, '..', 'data', 'db.json')

// In-memory database for Vercel (file system is read-only in production)
let memoryDB = null

export async function readDB() {
  // If we have memory DB, use it
  if (memoryDB) {
    return JSON.parse(JSON.stringify(memoryDB))
  }

  // Try to read from file (works locally and on Vercel during build)
  try {
    const txt = await fs.readFile(DB_PATH, 'utf8')
    memoryDB = JSON.parse(txt)
    return JSON.parse(JSON.stringify(memoryDB))
  } catch (err) {
    console.warn('Could not read db.json, using default seed data:', err.message)
    // Default seed data if file can't be read
    memoryDB = {
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
    return JSON.parse(JSON.stringify(memoryDB))
  }
}

export async function writeDB(data) {
  // Always update memory DB
  memoryDB = JSON.parse(JSON.stringify(data))

  // Try to write to file (works locally, fails silently on Vercel but data stays in memory)
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.warn('Could not write to db.json (expected on Vercel):', err.message)
    // Data is still in memoryDB, so it will persist for the lifetime of the function
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
