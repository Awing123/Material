import request from '@/utils/request'
const HOST = 'https://myoa.mmzqoa.net'

//根据系统用户ID映射目标系统用户ID
export function getSourceUserId(id) {
  return request({
    url: `/docexechange/gen-user/v1/deptmapperset/${id}`,
    method: 'get'
  })
}

// 会务系统-收阅报名
export function getReceiveRegistraList(params) {
  return request({
    url: HOST + '/pages/MoaZjmGw/getHwtzMsgCount.do',
    method: 'get',
    params: {
      ...params,
      pageNo: params.pageNo || params.page || 1,
      pageSize: params.pageSize || params.size || 10
    },
    decrypt: true
  }).then(res => {
    console.log(res)
    return res
  })
}