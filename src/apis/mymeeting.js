import request from '@/utils/request'


// 查询会议室列表
export function getMyMeetingList(params) {
  return request({
    url: `/meeting/org-user/participant`,
    method: 'get',
    params
  })
}


