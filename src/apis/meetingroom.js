import request from '@/utils/request'


// 查询会议室列表
export function getMeettingList(params) {
  return request({
    url: `/meeting/org-user/meeting-room`,
    method: 'get',
    params
  })
}
export function getMeetingRoomDetail(id) {
  return request({
    url: `/meeting/org-user/meeting-room/` + id,
    method: 'get'
  })
}

export function deleteList(ids) {
  return request({
    url: `/meeting/org-user/meeting-room/batch/` + ids,
    method: 'delete'
  })
}


export function addOrEditMeeting(id, data) {
  return request({
    url: `/meeting/org-user/meeting-room/` + (!id ? `addMeetingRoom` : `modify?roomId=` + id),
    method: 'post',
    data
  })
}


