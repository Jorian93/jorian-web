import request from '@/utils/request'

export function getFiles(data) {
  return request({
    url: '/fileUpload',
    method: 'Get',
    data
  })
}
export function deleteFile(data) {
  return request({
    url: '/fileUpload',
    method: 'Delete',
    data
  })
}
