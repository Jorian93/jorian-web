import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  //  // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://127.0.0.1:8085/',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token --['X-Token'] as a custom key.
      // please modify it according to the actual situation.
      config.headers['J-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    Message({
      message: error.errors[0],
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.status === 500) {
        // to re-login
        MessageBox.confirm('你已被登出，你可以选择继续待在此页面或重新登入', '确定登出', {
          confirmButtonText: '重新登入',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // 208: 未登录
      if (res.code === 208) {
        // to re-login
        MessageBox.confirm('你已被登出，你可以选择继续待在此页面或重新登入', '确定登出', {
          confirmButtonText: '重新登入',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log(error) // for debug
    Message({
      message: error.error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error || 'network error')
  }
)

export default service
