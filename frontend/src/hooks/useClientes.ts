import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getClientes, createCliente, deleteCliente, updateCliente } from '@/api/clientes'

export function useClientes() {
  const queryClient = useQueryClient()

  const query = useQuery(['clientes'], getClientes, {
    staleTime: 1000 * 60,
  })

  const create = useMutation((payload: any) => createCliente(payload), {
    onSuccess: () => queryClient.invalidateQueries(['clientes']),
  })

  const remove = useMutation((id: string | number) => deleteCliente(id), {
    onSuccess: () => queryClient.invalidateQueries(['clientes']),
  })

  const edit = useMutation(({ id, payload }: any) => updateCliente(id, payload), {
    onSuccess: () => queryClient.invalidateQueries(['clientes']),
  })

  return { ...query, create, remove, edit }
}
