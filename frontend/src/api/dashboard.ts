import { mockDB } from '../services/mockData'

export async function getDashboard() {
  return Promise.resolve(mockDB.getStats())
}

export async function getFechamentoMensal() {
  // Mock data for monthly closing
  return Promise.resolve({
    totalLent: 0,
    totalReceived: 0,
    profit: 0,
    expenses: 0
  })
}
