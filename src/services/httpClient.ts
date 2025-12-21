import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? 'Erro inesperado. Tente novamente.'

    if (status === 0 || status === 502 || status === 503) {
      return Promise.reject(new Error('API indisponível. Verifique o backend em :5000.'))
    }

    if (status === 409) {
      return Promise.reject(new Error('Item já cadastrado'))
    }

    return Promise.reject(new Error(message))
  },
)

