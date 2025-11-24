import { addDays, isAfter, startOfDay, differenceInCalendarDays } from 'date-fns'
import fs from 'fs/promises'
import path from 'path'

export const DB_PATH = path.resolve(process.cwd(), 'data', 'db.json')

export const LOAN_TERMS = {
  DEFAULT_DAYS: 20,
  INTEREST_RATE: 0.40,
  DAILY_FINE: 50,
}

export async function readDB() {
  const txt = await fs.readFile(DB_PATH, 'utf8')
  return JSON.parse(txt)
}

export async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
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
