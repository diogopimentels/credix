import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getEmprestimos, createEmprestimo, payEmprestimo } from '@/api/emprestimos'

export function useEmprestimos() {
  const queryClient = useQueryClient()

  const query = useQuery(['emprestimos'], getEmprestimos, {
    staleTime: 1000 * 60,
  })

  const create = useMutation((payload: any) => createEmprestimo(payload), {
    onSuccess: () => queryClient.invalidateQueries(['emprestimos']),
  })

  const pay = useMutation(({ id, payload }: any) => payEmprestimo(id, payload), {
    onSuccess: (_data, variables) => queryClient.invalidateQueries(['emprestimos']),
  })

  return { ...query, create, pay }
}
