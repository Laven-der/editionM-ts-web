import request from '@/utils/request'

export function login(username: string, password: string) {
  const data = {
    username,
    password
  }
  return request({
    url: '/user/doLogin',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getUserInfo(token: string) {
  return request({
    url: '/user/getUserinfo',
    method: 'get'
  })
}
