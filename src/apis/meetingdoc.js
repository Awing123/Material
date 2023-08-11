import request from '@/utils/request'
import authrequest from '@/utils/authrequest'

export function getMeetingList() {
  return request({
    url: `/meeting/org-user/meeting-room/list`,
    method: 'get'
  })
}
export function checkRoomConflict(roomId, startTime, endTime) {
  return request({
    url: `/meeting/org-user/meeting-doc/conflict?roomId=` + roomId + `&startTime=` + startTime + `&endTime=` + endTime,
    method: 'get'
  })
}

// 查询会议室列表
export function getMeettingDocList(params) {
  return request({
    url: `/meeting/org-user/meeting-doc/findMyMeetingDocPage`,
    method: 'get',
    params
  })
}
export function getMeetingDocDetail(id) {
  return request({
    url: `/meeting/org-user/meeting-doc/` + id,
    method: 'get'
  })
}

export function getNewTaskDetail(id) {
  return request({
    url: `/engine/user/v1/tasks/${id}/details-with-data?includeVariables=true`,
    method: 'get'
  })
}

// 通用获取表单详情
export function getDocInfo(businessKey) {
  return request({
    url: `/hr/gen-user/v1/docInfo/${businessKey}`,
    method: 'get'
  })
}

export function deleteDocList(id) {
  return request({
    url: `/meeting/org-user/meeting-doc/` + id,
    method: 'delete'
  })
}
export function publicMeetingDoc(id) {
  return request({
    url: `/meeting/org-user/meeting-doc/publicMeeting?docId=` + id,
    method: 'post'
  })
}

export function attendMeetingDoc(id, type) {
  return request({
    url: `/meeting/org-user/participant/participation/` + id + `?participation=` + type,
    method: 'post'
  })
}

export function addOrEditMeetingDoc(id, data) {
  return request({
    url: `/meeting/org-user/meeting-doc/` + (!id ? `addMeetingDoc` : `modifyMeetingDoc?docId=` + id),
    method: 'post',
    data
  })
}

export function startMeetingEvent(data) {
  return request({
    url: `/engine/org-user/v1/process-instances/start-with-data`,
    method: 'post',
    data
  })
}

export function loadAllDept() {
  return authrequest({
    url: `/organization/org-user/v1/contacts`,
    method: 'get'
  })
}

export function loadAllUserByDeptId(id) {
  return authrequest({
    url: `/organization/org-user/v1/contacts?departmentId=` + id,
    method: 'get'
  })
}

/**
 * 删除流程
 * @param data
 * @returns {AxiosPromise}
 */
export function delProcess(data) {
  return request({
    url: `/engine/org-user/v1/process-instances`,
    method: 'delete',
    data
  })
}


