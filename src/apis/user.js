import request from '@/utils/request'
const AUTH_HOST = 'https://auth.mmzqoa.net'

export function registerUser({ realname, username, password }) {
  return request({
    url: '/registeredUser',
    method: 'post',
    data: {
      realname, username, password
    }
  })
}

export function getUserList(data) {
  // return request({
  //   url: '/api/user/list',
  //   method: 'post',
  //   data
  // })
  console.log(data)
  return Promise.resolve([
    // id, name, phone, email, createTime, updateTime
    { id: 1, name: 'zhangsan', realname: '张三', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 2, name: 'lisi', realname: '李四', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 3, name: 'wangwu', realname: '王五', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 4, name: 'zhaoliu', realname: '赵六', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 5, name: 'tianqi', realname: '田七', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 6, name: 'qianba', realname: '钱八', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 7, name: 'sunjiu', realname: '孙九', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 8, name: 'zhoushi', realname: '周十', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 9, name: 'zhoushi', realname: '周十', createAt: '2019-01-01', updateAt: '2019-01-01' },
    { id: 10, name: 'zhoushi', realname: '周十', createAt: '2019-01-01', updateAt: '2019-01-01' }
  ])
}

export function deleteUser(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 获取部门列表
export function getDepartments(data) {
  return request({
    url: AUTH_HOST + '/organization/org-user/v1/departments',
    method: 'get',
    data
  })
}

// 根据部门id获取人员列表
export function getEmployeesByDepartmentId(id) {
  return request({
    url: AUTH_HOST + `/organization/org-user/v1/employees?departmentId=${id}`,
    method: 'get'
  })
}

// 根据部门id获取子部门列表
export function getDepartmentsByParentId(id) {
  return request({
    url: AUTH_HOST + `/organization/org-user/v1/departments?parentId=${id}`,
    method: 'get'
  })
}

// 获取机构单位列表
export function getOrganizations(params) {
  return request({
    url: AUTH_HOST + `/organization/sys-admin/v1/organizations`,
    method: 'get',
    params
  })
}