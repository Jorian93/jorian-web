import service from '@/utils/request'

export function login(data) {
  return service({
    url: '/account',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return service({
    url: '/account',
    method: 'get'
  })
}

export function logout() {
  return service({
    url: '/account',
    method: 'delete'
  })
}

export function getCurrentUserRouter(token) {
  return service({
    url: '/account/routers',
    method: 'get',
    params: { token }
  })
}

export function resetPassword(data) {
  return service({
    url: '/account/resetPassword',
    method: 'post',
    params: data
  })
}
