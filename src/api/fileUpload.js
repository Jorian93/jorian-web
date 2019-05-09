import request from '@/utils/request'

export function fileUpload(data) {
  return request({
    url: '/fileUpload', // 假地址 自行替换
    method: 'post',
    data
  })
}
