import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/kinds/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/kinds/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/kinds/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/kinds/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/kinds/update',
    method: 'post',
    data
  })
}

