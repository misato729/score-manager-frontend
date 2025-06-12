import axios from '@/api/axios'

export const updateTarget = async (target: string) => {
  return axios.put('api/users/target', { target })
}
