import type { AxiosResponse, AxiosRequestHeaders } from 'axios'
import axios from 'axios'
import qs from 'qs'
import { useUserStore } from '@/store'

const baseURL = import.meta.env.VITE_APP_BASE_API as string
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: baseURL,
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: { message: string }) => {
  console.log(error.message || 'error')

  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use(config => {
  const { token } = useUserStore()
  const headers = { ...config.headers } as AxiosRequestHeaders
  // 如果 token 存在
  if (token) {
    headers.token = token
  }
  if (config.method === 'get') {
    config.paramsSerializer = params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return { ...config, headers }
}, errorHandler)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<IResponse>): Promise<any> | AxiosResponse<IResponse> => {
    const data = response.data
    if (data.code && data.code !== 200) {
      if (data.code === 501) {
        const store = useUserStore()
        store.logout()
      }
      if (data.code === 401 || data.code === 403) {
        console.log('你已被登出，可以取消继续留在该页面，或者重新登录')
      } else if (data.code === 300) {
        // 300:重复登录;
        console.log('您的账号已经在其他地方登录')
      }
      console.log('error')
      return Promise.reject(new Error(data.message || 'Error'))
    }
    if (response.config.responseType === 'blob') {
      return response
    }
    return Promise.resolve(data)
  },
  errorHandler
)

export default request
