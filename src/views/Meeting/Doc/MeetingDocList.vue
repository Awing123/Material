<!-- 会议室管理查询新增页面 -->


<template>
  <v-card flat tile>
    <v-data-table v-model="selected" :headers="th" :items-per-page="page.pageSize" :items="dataPage.content"
      :server-items-length="dataPage.totalElements" @update:page="changeCurrentPage"
      @update:items-per-page="handleUpdatePageSize" item-key="roomId" :loading="dataFlag" loading-text="加载中... 请稍后！">

      <template v-slot:top>
        <div id="Mtitle" class="d-flex flex-wrap pa-2 mb-2 tool-bar">
          <span>会议标题：</span>
          <v-text-field full-width class="ma-2 flex-grow-0" label="会议标题" hide-details dense outlined
            v-model="page.docTitle" clearable></v-text-field>
            <span>会议内容：</span>
          <v-text-field full-width class="ma-2 flex-grow-0" label="会议内容" hide-details dense outlined
            v-model="page.message" clearable></v-text-field>
          <v-btn class="ma-2" color="primary" @click="changeCurrentPage(1)">查询</v-btn>
                    <v-btn class="ma-2" color="primary" @click="addOrEdit({})">新增</v-btn>

          <slot name="actions"></slot>
        </div>
      </template>
      <template v-slot:[`item.useState`]="{ item }">
        {{ item.useState === '0' ? '未发布' : '已发布' }}
      </template>

      <template v-slot:[`item.handle`]="{ item }">
        <v-btn x-small class="ma-1" @click="toDetail(item)">
          详情
        </v-btn>
        <!--        <v-btn v-if="item.useState === '0'"  x-small class="ma-1" color="primary" @click="addOrEdit(item)">-->
        <!--          -->
        <!--        </v-btn>-->
        <!--        <v-btn v-if="item.useState === '0'" x-small class="ma-1" color="error" @click="del([item])">-->
        <!--          删除-->
        <!--        </v-btn>-->
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
import { getMeettingDocList, deleteDocList, delProcess } from "@/apis/meetingdoc";


export default {
  name: "MeetingDoc",
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
        { text: '会议编号', align: 'center', sortable: false, value: 'headerXh' },
        { text: '会议标题', align: 'center', sortable: false, value: 'docTitle' },
        { text: '会议室', align: 'center', sortable: false, value: 'roomName' },
        { text: '会议开始时间', align: 'center', sortable: false, value: 'meetingBegin' },
        { text: '会议结束时间', align: 'center', sortable: false, value: 'meetingEnd' },
        { text: '联系人', align: 'center', sortable: false, value: 'contact' },
        { text: '联系电话', align: 'center', sortable: false, value: 'contactPhone' },
        { text: '是否发布', align: 'center', sortable: false, value: 'useState' },
        { text: '创建时间', align: 'center', sortable: false, value: 'createTime' },
        { text: '操作', align: 'center', sortable: false, width: '200', value: 'handle' }
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        docTitle: '',
        message: '',
      }
    };
  },
  created() {
    this.getMeetingListData();
  },
  filters: {},
  methods: {
    handleUpdatePageSize(pageSize) {
      this.page.pageSize = pageSize === -1 ? 10 : pageSize;
      this.getMeetingListData();
    },
    changeCurrentPage(page) {
      this.page.currentPage = page
      this.getMeetingListData()
    },
    /**
     * 分页数据接口
     */
    async getMeetingListData() {
      this.dataFlag = true

      getMeettingDocList(this.page).then(res => {
        this.dataPage = res.data
        this.dataFlag = false
      }).catch(error => {
        console.log('error:' + error.msg)
        this.dataFlag = false
      })
    },
    async delProcess(opinions) {
      opinions.forEach(function (item) {
        delProcess({ id: item.processId, reason: '删除会议' }).then(res => {
          return true
        }).catch(error => {
          return false
        })
      });

    },
    /**
     * 打开模态框
     */
    addOrEdit(meeting) {
      this.meeting = meeting
      this.$router.push({
        name: 'MeetingDocForm',
        params: {
          id: this.meeting.id
        }
      })
    },
    toDetail(meeting) {
      this.meeting = meeting
      this.$router.push({
        name: 'MeetingDocDetail',
        query: {
          docId: this.meeting.id,
          unit: false
        }
      })
    },
    async del(opinions) {
      this.$confirm({
        title: '确认删除?',
        content: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then(() => {
        const idArray = [];
        opinions.forEach(function (item) {
          idArray.push(item.id)
        });
        const ids = idArray.join(',')
        deleteDocList(ids).then(res => {
          if (!res.error) {
            this.delProcess(opinions)
            this.$message.success('删除成功')
            this.getMeetingListData();
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(() => {
        console.log("cancel");
      })



    }
  },
};
</script>


<style lang="scss" scoped>
#Mtitle {
  display: flex;
  align-items: center;
  // justify-content: center;
}


//类型样式，使其在同一个行线内
</style>
