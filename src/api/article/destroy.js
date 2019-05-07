import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/destroy/list',
    method: 'get',
    params: query
  })
}

export function fetchDestroy(id) {
  return request({
    url: '/destroy/detail',
    method: 'get',
    params: { id }
  })
}

export function updateDestroy(data) {
  return request({
    url: '/destroy/update',
    method: 'post',
    data
  })
}
