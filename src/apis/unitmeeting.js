import request from '@/utils/request'


// 查询会议室列表
export function getUnitMeetingList(params) {
  return request({
    url: `/meeting/org-user/meeting-doc`,
    method: 'get',
    params
  })
}


//MeetingDocListView的changeMeetingRome接口
export function changeMeetingRoom(docId, roomId, roomName) {
  return request({
    url: `/meeting/org-user/meeting-doc/` + docId + `?roomId=` + roomId + `&roomName=` + roomName,
    method: 'put'
  })
}


