import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// Request interceptors
service.interceptors.request.use(
  config => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      // config.headers["X-Access-Token"] = UserModule.token;
      config.headers['X-Token'] = UserModule.token
    }
    console.log(UserModule.token)
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    // loadingInstance.close()
    if (res.code !== 1) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 请自行在引入 MessageBox
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // UserModule
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          //   return
          // })
        })
      } else if (res.code === 403) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 2 * 1000
        })
        // store.dispatch('FedLogOut').then(() => {
        //   location.reload() // 为了重新实例化vue-router对象 避免bug
        // })
      } else {
        Message({
          message: res.msg || '服务器出错',
          type: 'error',
          duration: 2 * 1000
        })
      }
    } else {
      return response.data
    }
  },
  error => {
    // loadingInstance.close()
    console.log(error, 22222) // for debug
    Message({
      message: '服务器错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
