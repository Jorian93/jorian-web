import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: 'system/user/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: 'system/user/detail',
    method: 'get',
    params: { id }
  })
}

export function createUser(data) {
  return request({
    url: 'system/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'system/user/update',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: 'system/user/delete/' + id,
    method: 'delete'
  })
}
