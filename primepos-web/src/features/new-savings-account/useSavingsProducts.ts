import { useQuery } from '@tanstack/react-query'
import { getSavingsProducts } from '../../api/accounts'

export function useSavingsProducts() {
  return useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  })
}
