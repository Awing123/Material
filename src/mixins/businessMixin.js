import { DOC_TYPE } from "@/types/docType.type";
import { formatDate } from "@/utils/datetime";
import { getOrigin } from "@/utils/host";

export default {
  methods: {
    formatDate,
    // 查看业务详情
    goDetailView({ item, type, isDone = false }) {
      console.log(item, type);

      let { _formKey, _docType } = item.processVariables;

      if (!_formKey) console.log("_formKey未配置！");

      let businessKey = item.processInstanceBusinessKey || item.businessKey,
        formType = businessKey ? businessKey.split(":")[1] : "",
        typeObject = DOC_TYPE[formType || _docType];

      let isProcessDone = isDone ? '1' : '0'

      const search = `?id=${item.id}&businessKey=${businessKey}&processInstanceId=${item.processInstanceId}&type=${type}&done=${isProcessDone}`
      const host = getOrigin()

      if (!typeObject) {
        return this.$router.push({
          name: "AppFrame",
          query: {
            url: host + _formKey + search,
          },
        });
      }

      if (!businessKey) {
        return this.$message.error("不存在 businessKey，无法查看详情");
      }

      let url = typeObject.setUrl
        ? typeObject.setUrl({
          url: host + _formKey,
          id: item.id,
          businessKey,
          type
        })
        : `${typeObject.url}?${search}`;

      console.log(url);

      if (typeObject.iframe) {
        this.$router.push({
          name: "AppFrame",
          query: {
            url,
          },
        });
      } else {
        this.$router.push({
          path: url,
        });
      }
    },
    // 处理流程
    goProcessView(id) {
      if (!id) return this.$message.error('不存在流程ID，无法处理')
      this.$router.push({
        name: "AppFrame",
        query: {
          url: `${getOrigin()}/web/myoa-doc-handler/index.html#/task/complete?id=${id}`
        },
      });
    },
    // 查看流程进度
    goProcessResultView(item) {
      this.$router.push({
        name: "ProcessResult",
        params: {
          id: item.processInstanceId,
        },
      });
    },
  }
}
