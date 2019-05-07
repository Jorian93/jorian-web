import service from '@/utils/request'

export function fetchInfoList(query) {
  return service({
    url: '/baseInfo/list',
    method: 'get',
    params: query
  })
}

export function fetchInfo(id) {
  return service({
    url: '/baseInfo/detail',
    method: 'get',
    params: { id }
  })
}

export function createInfo(data) {
  return service({
    url: '/baseInfo/create',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return service({
    url: '/baseInfo/update',
    method: 'post',
    data
  })
}
