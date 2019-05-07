import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/license/list',
    method: 'get',
    params: query
  })
}

export function fetchLicense(id) {
  return request({
    url: '/license/detail',
    method: 'get',
    params: { id }
  })
}

export function createLicense(data) {
  return request({
    url: '/license/create',
    method: 'post',
    data
  })
}

export function updateLicense(data) {
  return request({
    url: '/license/update',
    method: 'post',
    data
  })
}
