import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'



export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const usuario = ref('')

  const cookies = useCookies(['token'])
  const getSessionToken = () => {
    return cookies.get('token')
  }
  const setSessionToken = (newToken: boolean) => {
    return cookies.set('token', newToken,
      {
        path: '/',
        // 10 minutos, para que seja possivel ver a expiracao de sessao
        // em funcionamento
        maxAge:  600
      })
  }

  const login = async (novoUsuario: string, senha: string) => {
    // requisicao a api vai aqui
    // talvez validar de novo?
    usuario.value = novoUsuario
    setSessionToken(true)
    return await router.push({ name: 'instrutor-home' })
  }
  const logout = async () => {
    usuario.value = ''
    setSessionToken(false)
    return await router.push({ name: 'login' })
  }
  const estaLogado = () => {
    return getSessionToken()
  }

  return {
    usuario,
    login,
    logout,
    estaLogado,
  }
})