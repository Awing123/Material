<template>
  <v-card flat tile>
    <v-data-table
        v-model="selected"
        :headers="th"
        :items-per-page="page.pageSize"
        :items="dataPage.content"
        :server-items-length="dataPage.totalElements"
        @update:page="changeCurrentPage"
        @update:items-per-page="handleUpdatePageSize"
        show-select
        item-key="materialId"
        :loading="dataFlag"
        loading-text="加载中... 请稍后！"
    >

      <template v-slot:top>
        <div id="Mtitle" class="d-flex flex-wrap pa-2 mb-2 tool-bar">
          <span>会议室名称：</span>
          <v-text-field
              full-width
              class="ma-2 flex-grow-0"
              label="会议室名称"
              hide-details
              dense
              outlined
              v-model="page.roomName"
              clearable
          ></v-text-field>
          <span>会议室地址：</span>
          <v-text-field
              full-width
              class="ma-2 flex-grow-0"
              label="会议室地址"
              hide-details
              dense
              outlined
              v-model="page.roomAddress"
              clearable
          ></v-text-field>
          <span>容纳人数：</span>
          <v-text-field
              full-width
              class="ma-2 flex-grow-0"
              label="容纳人数"
              hide-details
              dense
              outlined
              v-model="page.seatNumber"
              clearable
          ></v-text-field>
          <v-btn class="ma-2" color="primary" @click="changeCurrentPage(1)">查询</v-btn>

          <v-btn  class="ma-1" color="primary" @click="addOrEdit({})">新增</v-btn>
            <v-btn  class="ma-1" color="error"  :disabled="selected.length < 1" @click="del(selected)">批量删除</v-btn>
          <slot name="actions"></slot>
        </div>
      </template>


      <template v-slot:[`item.handle`]="{ item }">
        <v-btn  x-small class="ma-1" color="primary" @click="addOrEdit(item)">
          编辑
        </v-btn>
        <v-btn  x-small class="ma-1" color="error" @click="del([item])">
          删除
        </v-btn>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
// import { getMeettingList, deleteList} from "@/apis/meetingroom";
import { getMaterialList, deleteDocList } from "@/apis/classifylist";


export default {
  name: "MaterialClassifyList",
  components: {

  },
  data() {
    return {
      dataPage: {},
      meeting: {},
      selected: [], // 选中的数组
      editFlag: false,
      dataFlag: false,
      filterFlag: false,
      th: [
        { text: '会议室名称', align: 'center', sortable: false, value: 'roomName' },
        { text: '会议室地址', align: 'center', sortable: false, value: 'roomAddress' },
        { text: '容纳人数', align: 'center', sortable: false, value: 'seatNumber' },
        { text: '备注', align: 'center', sortable: false, value: 'remark' },
        { text: '创建时间', align: 'center', sortable: false, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, value: 'handle' }
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        roomName: '',
        roomAddress: '',
        seatNumber: '',
      }
    };
  },
  created() {
    this.getPage();
     this.$message.success("保存成功");
  },
  filters: {},
  methods: {
    handleUpdatePageSize(pageSize) {
      this.page.pageSize = pageSize === -1 ? 10 : pageSize;
      this.getPage();
    },
    changeCurrentPage(page) {
      this.page.currentPage = page
      this.getPage()
    },
    /**
     * 分页数据接口
     */
    async getPage() {
      this.dataFlag = true

      getMaterialList(this.page).then(res => {
        this.dataPage = res.data
        this.dataFlag = false
        
      }).catch(error => {
        console.log('error:' + error.msg)
        this.dataFlag = false
      })
    },
    /**
     * 打开模态框
     */
    addOrEdit(meeting) {
      this.meeting = meeting
      this.$router.push({
        name: 'MaterialClassifyAdd',
        params: {
          id: this.material.materialId
        }
      })
    },
    del(opinions) {
      this.$confirm({
        title: '确认删除?',
        content: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then(()=>{
        const idArray = [];
        opinions.forEach(function(item) {
          idArray.push(item.materialId)
        });
        const ids = idArray.join(',')
        deleteDocList(ids).then(res => {
          if (!res.error) {
            this.$message.success('删除成功')
            this.getPage();
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(()=>{
        console.log("cancel");
      })



    }
  },
};
</script>
<style lang="scss" scoped>
#Mtitle{
  display:flex;
  align-items:center;
}
</style>