
import { getTasksWithData, getTasksHisWithData, getTasksProcessWithData } from "@/apis/task";

export default {
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    // 调用不同类型详情
    getTaskDetail(params) {
      switch (this.type) {
        case 'todo':
          return getTasksWithData(params)
        case 'history':
          return getTasksHisWithData(params)
        case 'process':
          return getTasksProcessWithData(params)
        default:
          return Promise.resolve({})
      }
    },
  }
}
