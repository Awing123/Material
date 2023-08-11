import Vue from 'vue'
import Vuex from 'vuex'
import { fetchUserInfo, findRoles, getOrgRoles } from "@/apis/auth";
import { getClient } from "@/utils/desktop";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('accessToken') || '',
    userInfo: {},
    userRoles: {},
    orgRoles: [],
    client: getClient()
  },
  getters: {
    userId: state => state.userInfo.current ? state.userInfo.current.id : "",
    organization: state => state.userInfo.current ? state.userInfo.current.organization : {},
    permissions: state => state.userInfo.permissions || [],
    hasDocPermission: (state, getters) => getters.permissions.some(i => i.resourceTitle.includes('公文')),
    hasMeetingPermission: (state, getters) => getters.permissions.some(i => i.resourceTitle.includes('会务')),
    rolesList: (state) => Object.values(state.userRoles).map(i => i.name),
    rolesMap: (state) => state.orgRoles.reduce((result, item) => {
      result[item.id] = item
      return result
    }, {})
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setUserRoles(state, roles) {
      state.userRoles = roles
    },
    setOrgRoles(state, roles) {
      state.orgRoles = roles
    }
  },
  actions: {
    // 获取用户信息
    async getUserInfo({ state, commit }) {
      if (Object.keys(state.userInfo).length !== 0) return state.userInfo

      const { error, data } = await fetchUserInfo()
      if (error) return

      commit('setUserInfo', data)
      return data
    },
    // 获取单位角色列表
    async getOrgRoles({ state, commit }) {
      if (state.orgRoles.length) return
      const { error, data } = await getOrgRoles({ page: 0, size: 9999 })
      if (error) return

      commit('setOrgRoles', data.content)
      return data
    },
    // 获取用户角色
    async getRoles(context) {
      if (Object.keys(context.state.userRoles).length !== 0) return

      const { error, data } = await findRoles()
      if (error) return

      context.commit('setUserRoles', data)
      return data
    }
  },
  modules: {
  }
})
