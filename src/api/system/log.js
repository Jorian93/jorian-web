import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/license/list',
    method: 'get',
    params: query
  })
}

export function fetchLog(id) {
  return request({
    url: '/license/detail',
    method: 'get',
    params: { id }
  })
}

