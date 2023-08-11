import request from '@/utils/request'


// 查询本人意见列表
export function getOpinionList(params) {
  return request({
    url: `/personalization/gen-user/personalize-execute`,
    method: 'get',
    params
  })
}
export function deleteList(ids) {
  return request({
    url: `/personalization/gen-user/personalize-execute/batch/` + ids,
    method: 'delete'
  })
}


export function shareList(data) {
  return request({
    url: `/personalization/gen-user/personalize-execute/batchShareExecute`,
    method: 'post',
    data
  })
}


export function saveOpinion(data) {
  return request({
    url: `/personalization/gen-user/personalize-execute`,
    method: 'post',
    data
  })
}

export function editOpinion(params) {
  return request({
    url: `/personalization/gen-user/personalize-execute`,
    method: 'put',
    params
  })
}


