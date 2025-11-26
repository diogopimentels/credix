import { mockDB } from '../services/mockData'

export async function getClientes() {
  return Promise.resolve(mockDB.getClients())
}

export async function getCliente(id: string | number) {
  return Promise.resolve(mockDB.getClient(Number(id)))
}

export async function createCliente(payload: any) {
  return Promise.resolve(mockDB.addClient(payload))
}

export async function updateCliente(id: string | number, payload: any) {
  return Promise.resolve(mockDB.updateClient(Number(id), payload))
}

export async function deleteCliente(id: string | number) {
  mockDB.deleteClient(Number(id))
  return Promise.resolve({ success: true })
}
