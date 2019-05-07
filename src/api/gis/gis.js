import request from '@/utils/request'

export function fetchDevices(query) {
  return request({
    url: '/gis/deviceList',
    method: 'get',
    params: query
  })
}
export function fetchWarnings(query) {
  return request({
    url: '/gis/warningList',
    method: 'get',
    params: query
  })
}
export function fetchHealths(query) {
  return request({
    url: '/gis/healthList',
    method: 'get',
    params: query
  })
}

