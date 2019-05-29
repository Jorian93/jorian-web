import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params: query
  })
}

export function deleteLog(id) {
  return request({
    url: '/system/log/delete/' + id,
    method: 'delete'
  })
}

