import request from '@/utils/request'

// 获取任务列表
export function getTasks(params) {
  return request({
    url: '/engine/user/v1/tasks',
    method: 'get',
    params
  })
}

// 根据id获取任务详情
export function getTaskById(id) {
  return request({
    url: `/engine/user/v1/tasks/${id}`,
    method: 'get'
  })
}

// 根据表单id提交选择处理人和意见
export function saveForCompletion(id, data) {
  return request({
    url: `/engine/user/v1/tasks/${id}/save-for-completion`,
    method: 'post',
    data
  })
}

// 根据表单id提交选择处理人和意见
export function continueToComplete(id, data) {
  return request({
    url: `/engine/user/v1/tasks/${id}/continue-to-complete`,
    method: 'post',
    data
  })
}

// 获取历史任务列表
export function getHistoryTasks(params) {
  return request({
    url: '/engine/user/v1/tasks/his',
    method: 'get',
    params
  })
}

// 我的创建列表
export function getProcessInstances(params) {
  return request({
    url: '/engine/org-user/v1/process-instances',
    method: 'get',
    params
  })
}

// 根据流程实例编号查找已办任务列表
export function getHistoryTaskByProcessInstanceId(processInstanceId, page = 0, size = 20) {
  return request({
    url: '/engine/user/v1/tasks/his/of-process',
    method: 'get',
    params: {
      processInstanceId, page, size
    }
  })
}

// 任务列表-待办
export function getTasksTodo(params) {
  return request({
    url: '/engine/user/v1/tasks/todo',
    method: 'get',
    params
  })
}

// 任务列表-已办
export function getTasksHisDo(params) {
  return request({
    url: '/engine/user/v1/tasks/his-do',
    method: 'get',
    params
  })
}

// 任务列表-待阅
export function getTasksToRead(params) {
  return request({
    url: '/engine/user/v1/tasks/to-read',
    method: 'get',
    params
  })
}

// 任务列表-已阅
export function getTasksHisRead(params) {
  return request({
    url: '/engine/user/v1/tasks/his-read',
    method: 'get',
    params
  })
}

// 任务列表-草稿
export function getTasksDrafts(params) {
  return request({
    url: '/engine/user/v1/tasks/drafts',
    method: 'get',
    params
  })
}

// 任务详情-待办/待阅
export function getTasksWithData(params) {
  return request({
    url: `/engine/user/v1/tasks/${params.id}/with-data`,
    method: 'get',
    params
  })
}

// 任务详情-已办/已阅
export function getTasksHisWithData(params) {
  return request({
    url: `/engine/user/v1/tasks/his/${params.id}/with-data`,
    method: 'get',
    params
  })
}

// 任务详情-我的创建
export function getTasksProcessWithData(params) {
  return request({
    url: `/engine/org-user/v1/process-instances/${params.processInstanceId}/with-data`,
    method: 'get',
    params
  })
}

// 获取用户的公文交换的待收列表
export function getWaitIncomeList(params) {
  return request({
    url: `/docexechange/gen-user/v1/docexchange/getWaitIncomeList`,
    method: 'get',
    params: {
      ...params,
      type: params.type || '1',
      pageNo: params.page + 1,
      pageSize: params.size
    }
  })
}

// 用户公文交换待收列表文件签收
export function waitIncomeSign({ docId, accId }) {
  return request({
    url: `/docexechange/gen-user/v1/docexchange/waitIncomeSign`,
    method: 'post',
    params: {
      docId, accId
    }
  })
}

// 用户公文交换待收列表文件拒收
export function waitIncomeRejection({ docId, accId, rejectionReason }) {
  return request({
    url: `/docexechange/gen-user/v1/docexchange/waitIncomeRejection`,
    method: 'post',
    params: {
      docId, accId, rejectionReason
    }
  })
}