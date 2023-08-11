import request from '@/utils/request'


// 查询会议室列表
export function uploadFile(params) {
  return request({
    url: `/meeting/org-user/meeting-room`,
    method: 'get',
    params
  })
}


