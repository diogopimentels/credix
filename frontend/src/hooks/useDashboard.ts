import { useQuery } from '@tanstack/react-query'
import { getDashboard, getFechamentoMensal } from '@/api/dashboard'

export function useDashboard() {
  const dashboard = useQuery(['dashboard'], getDashboard, { staleTime: 1000 * 30 })
  const fechamento = useQuery(['fechamento-mensal'], getFechamentoMensal, { staleTime: 1000 * 60 })
  return { dashboard, fechamento }
}
