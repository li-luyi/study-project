import axios from 'axios';
import { Toast } from 'zarm';

const MODE = import.meta.env.MODE //环境变量

// 设置基础路径
axios.defaults.baseURL = MODE === 'development' ? '/api' : 'http://api.chennick.wang'
axios.defaults.withCredentials = true
// 设置请求头token处理
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务器异常！')
    return Promise.reject(res)
  }
  if (res.data.code !== 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }
  return res.data
})

export default axios