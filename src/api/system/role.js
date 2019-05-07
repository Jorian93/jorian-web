import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: '/system/role/detail',
    method: 'get',
    params: { id }
  })
}
export function createRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}
export function deleteRole(id) {
  return request({
    url: '/system/role/' + id,
    method: 'delete'
  })
}

export function updateRole(data) {
  return request({
    url: '/system/role/',
    method: 'put',
    data
  })
}

