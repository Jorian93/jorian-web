import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/job/list',
    method: 'get',
    params: query
  })
}

export function fetchJob(id) {
  return request({
    url: '/job/'+id,
    method: 'get',
  })
}

export function createJob(data) {
  return request({
    url: '/job/create',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/job/update',
    method: 'put',
    data
  })
}
export function deleteJob(id) {
  return request({
    url: '/job/delete/'+id,
    method: 'delete',
  })
}
