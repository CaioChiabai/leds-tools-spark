import axios from 'axios'
import { useUiStore } from '@/stores/ui'


// api para backend-admin, por isso adminApi.
export const adminApiConfig = {
  baseURL: import.meta.env.VITE_BACKEND_ADMIN_BASE_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_ADMIN_AUTH_TOKEN}`
  }
}

const adminApi = axios.create(adminApiConfig)

adminApi.interceptors.request.use((config) => {
  const ui = useUiStore()
  ui.carregando = true
  return config
}, (error) => {
  const ui = useUiStore()
  ui.carregando = false
  throw error
})

adminApi.interceptors.response.use((config) => {
  const ui = useUiStore()
  ui.carregando = false
  return config
}, (error) => {
  const ui = useUiStore()
  ui.carregando = false
  throw error
})

export default adminApi