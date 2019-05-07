import request from '@/utils/request'

export function fetchInfoKindList(query) {
  return request({
    url: '/infoKind/list',
    method: 'get',
    params: query
  })
}

export function fetchKind(id) {
  return request({
    url: '/infoKind/detail',
    method: 'get',
    params: { id }
  })
}

export function createKind(data) {
  return request({
    url: '/infoKind/create',
    method: 'post',
    data
  })
}

export function updateKind(data) {
  return request({
    url: '/infoKind/update',
    method: 'post',
    data
  })
}

