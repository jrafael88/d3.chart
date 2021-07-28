import axios from 'axios'
import { getHost } from '../constants/config'

const { url } = getHost().url

const api = axios.create({
  baseURL: url,
  headers: { 'Content-Type': 'application/json' },
})

const onResponseSuccess = (response) => response?.data

const onResponseError = (error) => {
  throw new Error(error?.response?.data?.message)
}

api.interceptors.response.use(onResponseSuccess, onResponseError)

export default api
