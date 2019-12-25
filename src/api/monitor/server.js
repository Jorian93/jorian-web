import request from '@/utils/request'

export function fetchDruid(query) {
  return request({
    url: '/gis/deviceList',
    method: 'get',
    params: query
  })
}
export function fetchRabbitMQ(query) {
  return request({
    url: '/gis/warningList',
    method: 'get',
    params: query
  })
}
export function fetchELK(query) {
  return request({
    url: '/gis/healthList',
    method: 'get',
    params: query
  })
}

