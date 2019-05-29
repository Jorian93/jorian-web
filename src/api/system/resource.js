import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'system/resource/list',
    method: 'get',
    params: query
  })
}
export function fetchTree() {
  return request({
    url: 'system/resource/tree',
    method: 'get'

  })
}

export function fetchTreeCheckedNode(rid) {
  return request({
    url: 'system/resource/' + rid,
    method: 'get'
  })
}

export function fetchResource(id) {
  return request({
    url: 'system/resource/detail',
    method: 'get',
    params: { id }
  })
}

export function createResource(data) {
  return request({
    url: 'system/resource/add',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: 'system/resource/update',
    method: 'put',
    data
  })
}

export function deleteResource(id) {
  return request({
    url: 'system/resource/delete/' + id,
    method: 'delete'
  })
}
