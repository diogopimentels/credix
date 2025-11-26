import { mockDB } from '../services/mockData'

export async function getEmprestimos() {
  return Promise.resolve(mockDB.getLoans())
}

export async function getEmprestimo(id: string | number) {
  // Not implemented in mockDB yet, but we can find it in the list
  const loans = mockDB.getLoans()
  const loan = loans.find((l: any) => l.id === Number(id))
  return Promise.resolve(loan)
}

export async function createEmprestimo(payload: any) {
  return Promise.resolve(mockDB.addLoan(payload))
}

export async function payEmprestimo(id: string | number, payload: any) {
  // Payload might contain amount, etc. For now just mark as paid or handle partials if we wanted to be fancy.
  // The mockDB.payLoan just marks as paid.
  return Promise.resolve(mockDB.payLoan(Number(id)))
}

export async function deleteEmprestimo(id: string | number) {
  // mockDB doesn't have deleteLoan yet, let's add it or ignore
  // For now, let's assume we can't delete loans in this prototype or just do nothing
  return Promise.resolve({ success: true })
}
