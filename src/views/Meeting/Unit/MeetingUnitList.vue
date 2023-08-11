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
        item-key="docId"
        :loading="dataFlag"
        loading-text="加载中... 请稍后！"
    >

      <template v-slot:top>
        <div class="d-flex flex-wrap pa-2 mb-2 tool-bar">
          <v-text-field
              full-width
              class="ma-2 flex-grow-0"
              label="会议名称"
              hide-details
              dense
              outlined
              v-model="page.docTitle"
              clearable
          ></v-text-field>
          <!--          <v-datetime-picker-->
          <!--              full-width-->
          <!--              class="ma-2 flex-grow-0"-->
          <!--              label="会议开始时间"-->
          <!--              hide-details-->
          <!--              dense-->
          <!--              outlined-->
          <!--              v-model="page.meetingBegin"-->
          <!--              clearable-->
          <!--          ></v-datetime-picker>-->
          <!--          <v-datetime-picker-->
          <!--              full-width-->
          <!--              class="ma-2 flex-grow-0"-->
          <!--              label="会议结束时间"-->
          <!--              hide-details-->
          <!--              dense-->
          <!--              outlined-->
          <!--              v-model="page.meetingEnd"-->
          <!--          ></v-datetime-picker>-->
          <v-btn class="ma-2" color="primary" @click="changeCurrentPage(1)">查询</v-btn>
          <slot name="actions"></slot>
        </div>

        <div class="d-flex flex-wrap pa-2 mb-2 tool-bar">
<!--          <v-btn  small class="ma-1" color="primary" @click="addOrEdit({})">新增</v-btn>-->
<!--          <v-btn  small class="ma-1" color="error"  :disabled="selected.length<1" @click="del(selected)">批量删除</v-btn>-->
        </div>
      </template>


      <template v-slot:[`item.handle`]="{ item }">
        <v-btn  x-small class="ma-1" @click="toDetail(item)">
          详情
        </v-btn>
<!--        <v-btn  x-small class="ma-1" color="primary" @click="addOrEdit(item)">-->
<!--          编辑-->
<!--        </v-btn>-->
<!--        <v-btn  x-small class="ma-1" color="error" @click="del([item])">-->
<!--          删除-->
<!--        </v-btn>-->
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
import { getUnitMeetingList} from "@/apis/unitmeeting";


export default {
  name: "UnitMeeting",
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
        { text: '会议标题', align: 'center', sortable: false, value: 'docTitle' },
        { text: '会议室', align: 'center', sortable: false, value: 'roomName' },
        { text: '会议开始时间', align: 'center', sortable: false, value: 'meetingBegin' },
        { text: '会议结束时间', align: 'center', sortable: false, value: 'meetingEnd' },
        { text: '联系人', align: 'center', sortable: false, value: 'contact' },
        { text: '联系电话', align: 'center', sortable: false, value: 'contactPhone' },
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
    toDetail(meeting) {
      this.$router.push({
        name: 'MeetingDocDetail',
        query: {
          docId: meeting.id,
          unit: true
        }
      })
    },
    /**
     * 分页数据接口
     */
    async getMeetingListData() {
      this.dataFlag = true

      getUnitMeetingList(this.page).then(res => {
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
        name: 'MeetingRoomForm',
        params: {
          id: this.meeting.roomId
        }
      })
    }
  },
};
</script>
