import request from '@/utils/request'
const AUTH_HOST = process.env.VUE_APP_AUTH_API//'https://auth.mmzqoa.net'
import { ROLE_TYPE } from '@/types/role.type'
const roleTypeList = Object.values(ROLE_TYPE)

export function fetchUserInfo() {
  return request({
    url: AUTH_HOST + '/auth/v1/users/info',
    method: 'get'
  })
}

// 重设密码
export function resetPassword(data) {
  return request({
    url: AUTH_HOST + "/auth/v1/users/resetPassword",
    method: 'put',
    data
  })
}


// 查找应用模块列表
export function getModules(params) {
  return request({
    url: AUTH_HOST + '/auth/sys-admin/modules',
    method: 'get',
    params
  })
}

// 应用模块-新增
export function addModules(data) {
  return request({
    url: AUTH_HOST + '/auth/sys-admin/modules',
    method: 'post',
    data
  })
}

// 应用模块-更新
export function updateModules(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/modules/${data.id}`,
    method: 'put',
    data
  })
}

// 应用模块-删除
export function removeModules(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/modules/${data.id}`,
    method: 'delete'
  })
}

// 应用模块-启用
export function enableModules(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/modules/enable/${data.id}`,
    method: 'put'
  })
}

// 应用模块-禁用
export function disableModules(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/modules/disable/${data.id}`,
    method: 'put'
  })
}

// 查找资源列表-管理员
export function getResources(params) {
  return request({
    url: AUTH_HOST + '/auth/sys-admin/resources',
    method: 'get',
    params
  })
}

// 创建资源
export function addResources(data) {
  return request({
    url: AUTH_HOST + '/auth/sys-admin/resources',
    method: 'post',
    data
  })
}

// 更新资源
export function updateResources(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/resources/${data.id}`,
    method: 'put',
    data
  })
}

// 启用资源
export function enableResource(id) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/resources/enable/${id}`,
    method: 'put'
  })
}

// 获取单位角色列表
export function getOrgRoles(params) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/roles`,
    method: 'get',
    params
  })
}

// 查询拥有角色
export function findRoles(data = roleTypeList) {
  return request({
    url: AUTH_HOST + `/auth/v1/users/find-roles`,
    method: 'post',
    data
  })
}

// 创建角色
export function addRoles(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/roles`,
    method: 'post',
    data
  })
}

// 更新角色
export function updateRoles(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/roles/${data.id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function removeRoles(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/roles/${data.id}`,
    method: 'delete'
  })
}

// 根据角色id查询资源
export function getPermissions(params) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/permissions`,
    method: 'get',
    params
  })
}

// 为角色新增资源
export function addRoleResource(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/permissions`,
    method: 'post',
    data
  })
}

// 角色删除资源
export function removeRoleResource(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/permissions/${data.id}`,
    method: 'delete'
  })
}

// 获取单位资源列表
export function getOrgResources(params) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/resources`,
    method: 'get',
    params
  })
}

// 模块注册-列表
export function getModulesRegistrations(params) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/org-module-registrations`,
    method: 'get',
    params
  })
}

// 模块注册-新增
export function addModulesRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/org-module-registrations`,
    method: 'post',
    data
  })
}

// 模块注册-删除
export function removeModulesRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/org-module-registrations/${data.id}`,
    method: 'delete'
  })
}

// 模块注册-启用
export function enableModulesRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/org-module-registrations/enable/${data.id}`,
    method: 'put'
  })
}

// 模块注册-禁用
export function disableModulesRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/sys-admin/org-module-registrations/disable/${data.id}`,
    method: 'put'
  })
}

// 用户管理-查找
export function getEmployees(params) {
  return request({
    url: AUTH_HOST + `/organization/org-user/v1/employees`,
    method: 'get',
    params
  })
}

// 员工角色映射-查找
export function getRoleRegistrations(params) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/role-registrations`,
    method: 'get',
    params
  })
}

// 员工角色映射-新增
export function addRoleRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/role-registrations`,
    method: 'post',
    data
  })
}

// 员工角色映射-删除
export function removeRoleRegistrations(data) {
  return request({
    url: AUTH_HOST + `/auth/org-admin/v1/role-registrations`,
    method: 'delete',
    data
  })
}

