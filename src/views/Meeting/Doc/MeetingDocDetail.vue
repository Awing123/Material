<!-- MeetingDocDetail会议室办理情况 -->
<template>
  <div>
    <!-- 表单 -->
    <TableForm :json="formJson">
      
      <!-- 按钮都用上了color="primary" -->
      <template #actions>
        <v-btn
            color="primary"
            v-if="showBtn"
            @click="showLeaveVODialog = true">重新分配会议室</v-btn>
        <!-- v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染 -->
        <v-btn
            class="ml-4"
            color="primary"
            v-if="isDetail && details.useState === '0' && !isMyMeeting && (taskName !== '办公室审批' || taskName !== '办理情况' || taskName !== '提交申请') "
            @click="toPost()">发布</v-btn
        >
        <v-btn
            class="ml-4"
            color="primary"
            v-if="taskName === '办公室审批' || taskName === '提交申请'"
            @click="addOrEdit()">修改</v-btn
        >
        <v-btn
            class="ml-4"
            color="primary"
            v-if="taskName === '办公室审批' || taskName === '提交申请'"
            @click="del()">删除</v-btn
        >
        <v-btn
            class="ml-4"
            color="primary"
            v-if="isMyMeeting"
            @click="toAttend(true)">参加</v-btn
        >
        <v-btn
            class="ml-4"
            color="primary"
            v-if="isMyMeeting"
            @click="toAttend(false)">不参加</v-btn
        >
      </template>



      <template #files>
        <tr>
          <td colspan="1" class="label-td">
              <span class="label">附件列表</span>
          </td>
          <td colspan="3">
            <FileUploadNew :value="fileList" full-key="files" :full-schema="fullSchema" :success="uploadSuccess" :options="options" :rules="rules" :schema="schema"></FileUploadNew>
            <!-- 上传文件列表 full-key全键 -->
          </td>
        </tr>
      </template>
    </TableForm>


    <v-dialog v-model="showLeaveVODialog" max-width="500px">
      <v-card>
        <v-card-title> 请选择会议室 </v-card-title>


        <!-- 会议室名称和id进行绑定 -->
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-select
                  :items="roomList"
                  item-text="roomName"
                  item-value="roomId"
                  required
                  v-model="roomId"
                  label="会议室"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="showLeaveVODialog = false"
          >取消</v-btn
          >
          <v-btn color="primary" @click="onChangeRoom">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import .. from ""按需导入
import TableForm from "@/components/TableComponent/TableForm";
import { generateLabelAndTextByList } from "@/utils/table";
import {
  attendMeetingDoc,//参加会议
  deleteDocList, delProcess,
  getDocInfo,
  getMeetingDocDetail,
  getMeetingList, getNewTaskDetail,
  publicMeetingDoc
} from "@/apis/meetingdoc";//对接接口
import {changeMeetingRoom} from "@/apis/unitmeeting";//改变会议
import FileUploadNew from "@/components/fileUploadNew";
export default {
  components: {
    TableForm,
    FileUploadNew
  },
  data() {
    return {
      showLeaveVODialog: false,
      roomList:[],
      roomId: '',
      roomName:'',
      showBtn: false,//showBtn默认为false
      tyep: '',
      docId:'',
      taskId: '',
      processInstanceId:'',
      taskDetail: {},
      taskName: '',
      fileList: [],
      files: [],
      options:{},
      schema:{
        readonly: true,
        transparent: true
        // 使用return包裹的数据会在项目的全局可见，不会造成变量污染, 使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件
      },
      fullSchema:{},
      rules:[],
      on:{},
      participantId:'',
      formJson: {
        title: "会议详情",
        table: [],
      },
      details: {}
    };
  },

  // computed计算属性
  computed: {
    businessKey() {
      return this.$route.query.businessKey;//查看业务情况
    },
    isDetail() {
      return this.docId
    },
    isMyMeeting() {
      return this.$route.params.mymeeting
    }
  },
  async created() {
    console.log('id:'+this.$route.query.id)
    console.log('businessKey:'+this.$route.query.businessKey)
    console.log('processInstanceId:'+this.$route.query.processInstanceId)
    console.log('type:'+this.$route.query.type)
    console.log('done:'+this.$route.query.done)

    this.docId = this.$route.query.docId
    if (!this.docId) {
      this.taskId = this.$route.query.id
      this.businessKey = this.$route.query.businessKey
      this.processInstanceId = this.$route.query.processInstanceId
      this.type = this.$route.query.type
    } else {
      this.participantId = this.$route.query.parparticipantId
      this.showBtn = this.$route.query.unit
      //query用于传参
    }

    await this.initData();
  },
  mounted() {
    // 每次进入页面都会执行
    window.addEventListener("message", this.handleMessage);
  },
  destroyed() {
    window.removeEventListener("message", this.handleMessage);
  },
  methods: {
    handleMessage(event) {
      if ((typeof event.data != 'string') || event.data.constructor != String) return;
      const data = JSON.parse(event.data);
      if (data) {
        if (data.type === 'loadstop') {
          // 加载完成
          this.initData()
        }
      }
    },
    async initData() {
      const loading = this.$loading();
      //获取用户信息
      const that = this
      if (this.docId) {
        getMeetingDocDetail(that.docId).then(res => {
          loading.close()
          that.details = res.data
          that.setDetail(res.data)
        }).catch(error => {
          loading.close()
          console.log(error)
        })
      } else {
        getNewTaskDetail(this.taskId).then(res => {
          loading.close()
          that.taskDetail = res.data
          that.details = res.data.businessData
          that.setDetail(res.data.businessData)
          if (res.data.task.endTime) {
            that.taskName = ''
          } else {
            console.log('getNewTaskDetail:' + res.data.task.name)
            that.taskName = res.data.task.name
          }
          console.log('taskName:' + that.taskName)
          if (that.taskName === '办理情况' && that.details.useState === '0') {
            this.toPostAsync()
          }
        }).catch(error => {
          loading.close()
          console.log('加载任务失败')
          if (that.businessKey) {
            getMeetingDocDetail(that.businessKey).then(res1 => {
              that.details = res1.data
              that.setDetail(res1.data)
            }).catch(error1 => {

              console.log(error1)
            })
          }
        })
      }

      if (this.showBtn) {
        // 判断showBtn
        this.loadRoomList()
      }
    },
    uploadSuccess(files) {

    },
    /**
     * 打开模态框
     */

    //  修改渲染
    addOrEdit() {
      this.$router.push({
        name: 'MeetingDocForm',
        params: {
          id: this.details.id
        }
      })
    },

    // 删除后，您将无法恢复！板块
    async del() {
      this.$confirm({
        title: '确认删除?',
        content: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then(()=>{
        const idArray = [];
        idArray.push(this.details.id)

        const ids = idArray.join(',')
        deleteDocList(ids).then(res => {
          if (!res.error) {
            this.delProcess(this.details.processId)
            this.$message.success('删除成功')
            this.initData()
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(()=>{
        console.log("cancel");
      })
    },



    async delProcess(processId) {
        delProcess({id: processId, reason: '删除会议'}).then(res => {
          return true
        }).catch(error => {
          return false
        })
    },

    //发布数据渲染
    toPost() {
      this.$confirm({
        title: '确认发布?',
        content: '确认是否发布会议，发布后不能修改！',
        icon: 'warning'
      }).then(()=>{
        publicMeetingDoc(this.docId).then(res => {
          if (!res.error) {
            this.$message.success('发布成功')
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(()=>{
        console.log("cancel");
      })

    },
    toPostAsync() {
      publicMeetingDoc(this.docId).then(res => {
        if (!res.error) {
          this.$message.success('发布成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },


    // 是否参加
    toAttend(type) {
      this.$confirm({
        title: '确认参加?',
        content: '确认是否参加该次会议！',
        icon: 'warning'
      }).then(()=>{
        attendMeetingDoc(this.participantId, type).then(res => {
          if (!res.error) {
            this.$message.success('参加成功')
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(()=>{
        console.log("cancel");
      })

    },



    loadRoomList() {
      getMeetingList().then(res => {
        this.roomList = res.data
      })
    },
    setDetail(data) {
      this.roomId = data.roomId
      this.roomName = data.roomName
      this.docId = data.id

      this.formJson.title = "会议详情";
      let users = '';
      const userNames = []
      this.fileList = data.attaches
      data.attendees.forEach(function (item, index) {
        userNames.push(item.employeeName)
      })
      users = userNames.join(", ")

      this.formJson.table = [
        [
          ...generateLabelAndTextByList([
            { label: "会议标题", text: data.docTitle, colspan: 3 },
          ]),
        ],
        [
          ...generateLabelAndTextByList([
            { label: "会议编号", text: data.headerXh },
            { label: "会议室", text: data.roomName },
          ]),
        ],
        [
          ...generateLabelAndTextByList([
            { label: "会议开始时间", text: data.meetingBegin },
            { label: "会议结束时间", text: data.meetingEnd },
          ]),
        ],
        [
          ...generateLabelAndTextByList([
            { label: "联系人", text: data.contact },
            { label: "联系人电话", text: data.contactPhone },
          ]),
        ],
        [
          ...generateLabelAndTextByList([
            { label: "参会人员", text: users, colspan: 3 },
          ]),
        ],
        [
          ...generateLabelAndTextByList([
            { label: "会议内容", text: data.message, colspan: 3 },
          ]),
        ],
      ];
    },


    async onChangeRoom() {
      this.showLeaveVODialog = false
      for(let i=0; i < this.roomList.length; i++){
        if (this.roomList[i].roomId === this.roomId) {
          this.roomName = this.roomList[i].roomName
          break;
        }
      }

      const loading = this.$loading();
      const {error, message} = await changeMeetingRoom(this.docId, this.roomId, this.roomName);
      loading.close();
      if (error) this.$message.error(message);
      else this.$emit("success");
      this.$message.success("提交成功");

      this.showLeaveVODialog = false

      let data = {};
      data = (await getMeetingDocDetail(this.docId)).data;
      this.setDetail(data)
    }
  }
};
</script>
