import api from './axios'

export interface VisitedShop {
  id: number
  name: string
  address: string
  created_at: string
  user_name?: string
}

export type VisitedShopsResponse =
  | VisitedShop[]
  | {
      user_name?: string
      visited_shops?: VisitedShop[]
    }

export const fetchUserVisitedShops = async (userId: string) => {
  const response = await api.get<VisitedShopsResponse>(
    `/api/users/${encodeURIComponent(userId)}/visited-shops`,
  )
  return response.data
}
