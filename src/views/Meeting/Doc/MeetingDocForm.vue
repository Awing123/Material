<!-- 会议室申请表格 -->

<template>
  <div>
    <v-form class="form pb-16" ref="form" lazy-validation>
      <div class="formTitle pa-5">
        <h2 v-if="!$vuetify.breakpoint.mobile">{{ title }}</h2>
      </div>

      <v-row>

        <v-col cols="12" sm="12">
          <v-text-field
              :outlined="false"
              v-model="formModel.docTitle"
              required
              v-bind="textFieldProps({ label: '文件标题' })">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
              :outlined="false"
              v-model="formModel.headerXh"
              label="文件编号">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
              :items="roomList"
              :outlined="false"
              item-text="roomName"
              item-value="roomId"
              required
              v-model="formModel.roomId"
              label="会议室"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <DatetimePicker
              :outlined="false"
              dense

              required
              v-model="formModel.meetingBegin"
              v-bind="textFieldProps({ label: '会议开始时间' })">
          </DatetimePicker>
        </v-col>
        <v-col cols="12" sm="6">
          <DatetimePicker
              :outlined="false"
              dense

              required
              v-model="formModel.meetingEnd"
              v-bind="textFieldProps({ label: '会议结束时间' })">
          </DatetimePicker>

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
              :outlined="false"
              required
              v-model="formModel.contact"
              v-bind="textFieldProps({ label: '联系人' })">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
              :outlined="false"
              required
              v-model="formModel.contactPhone"
              v-bind="textFieldProps({ label: '联系电话' })">
          </v-text-field>

        </v-col>
      </v-row>


      <v-textarea
          style="margin-top:40px"
          outlined
          required
          counter
          v-model="formModel.message"
          label="会议内容"
      ></v-textarea>

      <p>选择参会人员</p>

      <v-row style="padding: 0 10px;">
        <v-col cols="12" sm="5" class="user-box">
          <v-treeview
              v-model="selectUser"
              selectable
              dense
              item-disabled="locked"
              :outlined="false"
              :items="userTree"
          ></v-treeview>
        </v-col>
        <v-col cols="12" sm="2">
          <v-img
              :lazy-src="leftRightChangeImg"
              max-height="50"
              max-width="70"
              class="chang-img"
              :src="leftRightChangeImg"
          ></v-img>
        </v-col>
        <v-col cols="12" sm="5" class="user-box">
          <div class="name-item" v-for="(item,i) in rightUsers" :key="i">
            <v-img
                :lazy-src="delImg"
                max-height="16"
                max-width="16"
                @click="delUser(item.employeeId)"
                class="name-del"
                :src="delImg"></v-img>
            <span>{{ item.employeeName }}</span>
          </div>
        </v-col>
      </v-row>

  <!-- full-key文件类型 -->
     <p style="margin-top: 40px;">上传附件</p>
        <v-row style="padding: 0 10px;">
          <v-col cols="12" sm="12">
            <FileUploadNew :value="fileList" full-key="files" :full-schema="fullSchema" :success="uploadSuccess" :options="options" :rules="rules" :schema="schema"></FileUploadNew>
          </v-col>
  
        </v-row>


    </v-form>
    <div class="btn-box">
<!--      <v-btn v-if="$vuetify.breakpoint.mobile" block elevation="5" large color="primary" @click="onSave">保存</v-btn>-->
<!--      <v-btn v-else large color="primary" @click="onSave">保存</v-btn>-->

      <v-btn v-if="$vuetify.breakpoint.mobile" block elevation="5" :loading="handleLoading" large color="primary" style="margin-top: 20px;" @click="onSaveSubmit">保存并提交</v-btn>
      <v-btn v-else large color="primary" :loading="handleLoading" @click="onSaveSubmit" style="margin-left: 20px;">保存并提交</v-btn>
    </div>
  </div>
</template>

<script>
import DatetimePicker from "@/components/DatetimePicker";
import FileUploadNew from "@/components/fileUploadNew";
import {
  getMeetingDocDetail,
  loadAllDept,
  loadAllUserByDeptId,
  getMeetingList,
  checkRoomConflict, startMeetingEvent
} from "@/apis/meetingdoc";
import {formatDate, startBigToEnd} from "@/utils/datetime"
import {getOrigin} from "@/utils/host";


export default {
  name: "MeetingDocForm",
  components: {
    DatetimePicker,
    FileUploadNew
  },
  data() {
    return {
      leftRightChangeImg: require("@/assets/left_right_change.png"),
      delImg: require("@/assets/del.png"),
      userTree: [],
      selectUser: [],
      roomList: [],
      users: [],
      rightUsers: [],
      userMap: [],
      readonly: false,
      fileList: [],
      files: [],
      options:{},
      schema:{},
      fullSchema:{},
      rules:[],
      on:{},
      handleLoading: false,
      formModel: {
        id: "",
        docTitle: "",
        headerXh: "",
        roomId: "",
        roomName: "",
        meetingBegin: "",
        meetingEnd: "",
        contact: "",
        contactPhone: "",
        message: "",
        attendees: []
      }
    };
  },
  computed: {
    title() {
      return this.formModel.id ? '编辑会议' : '新增会议'
    },
  },
  watch: {
    selectUser(val) {
      console.log(val)
      const that = this;
      this.rightUsers = []
      val.forEach(function (item, index) {
        that.rightUsers.push(that.getUserMapItem(item))
      })

    },
  },
  async created() {
    this.loadRoomList();
    this.formModel.id = this.$route.params.id;
    if (!!this.formModel.id) {
      await this.getMeetingDocDetail();
    }

    await this.loadSelectUser();
  },
  methods: {
    uploadSuccess(files) {
      console.log('upload success')
      console.log('files:' + files);
      this.files = files
    },
    delUser(id) {
      this.selectUser.splice(this.selectUser.indexOf(id), 1)
    },
    loadRoomList() {
      getMeetingList().then(res => {
        this.roomList = res.data
      })
    },
    /**
     * 加载所有用户，按部门分
     */
    async loadSelectUser() {
      const that = this;
      await loadAllDept().then(res => {
        if (!res.error) {
          res.data.departments.forEach(function (item, index) {
            const tempItem = {}
            tempItem.id = item.id
            tempItem.name = item.name
            tempItem.type = 0
            tempItem.children = []
            that.userTree.push(tempItem)
          })
        }
      })

      for (const item of this.userTree) {
        item.children = (await that.getAllUserByDeptId(item.id))
      }

      console.log("set user")
      console.log(this.users)
      this.selectUser = this.users;
      console.log("set user end")
    },
    async getAllUserByDeptId(id) {
      const that = this;
      return await loadAllUserByDeptId(id).then(res => {
        const users = []
        res.data.employees.forEach(function (item, index) {
          const user = {}
          user.id = item.id
          user.name = item.name
          user.phone = item.phone
          user.type = 1
          users.push(user)
          that.userMap.push(user)
        })
        return users;
      })
    },
    getMeetingDocDetail() {
      const that = this;
      getMeetingDocDetail(this.formModel.id).then(res => {
        that.formModel = res.data

        res.data.attendees.forEach(function (item, index) {
          console.log(item.employeeId)
          that.users.push(item.employeeId)
        })
        console.log("detail user")
        console.log(that.users)
        console.log("detail user end")

        this.fileList = res.data.attaches || []
        this.files = res.data.attaches || []
      }).catch(error => {

      })
    },
    textFieldProps({label}) {
      return {
        label,
        outlined: true,
        rules: [(v) => !!v || `${label}不能为空`],
      };
    },
    getUserMapItem(id) {
      const item = {}
      for (let i = 0; i < this.userMap.length; i++) {
        if (this.userMap[i].id === id) {
          item.employeeId = this.userMap[i].id
          item.employeeName = this.userMap[i].name
          item.employeePhone = this.userMap[i].phone
          break;
        }
      }
      return item
    },
    async checkRoomConflict() {
      const that = this;
      return await checkRoomConflict(that.formModel.roomId, that.formModel.meetingBegin, that.formModel.meetingEnd).then(res => {
        return res.data;
      })
    },
    async onSave() {

      if (this.$refs.form.validate()) {
        if (this.formModel.meetingBegin === '') {
          this.$message.error("会议开始时间不能为空");
          return;
        }
        if (this.formModel.meetingEnd === '') {
          this.$message.error("会议结束时间不能为空");
          return;
        }
        this.formModel.meetingBegin = formatDate(this.formModel.meetingBegin, 'yyyy-MM-dd hh:mm')
        this.formModel.meetingEnd = formatDate(this.formModel.meetingEnd, 'yyyy-MM-dd hh:mm')
        if (startBigToEnd(this.formModel.meetingBegin, this.formModel.meetingEnd)) {
          this.$message.error("开始时间不能大于结束时间");
          return;
        }

        const isFlag = await this.checkRoomConflict();
        if (isFlag) {
          this.$message.error("会议室该时间段已被占用，请选择其他时间段");
          return;
        }

        for (let i = 0; i < this.roomList.length; i++) {
          if (this.roomList[i].roomId === this.formModel.roomId) {
            this.formModel.roomName = this.roomList[i].roomName
            break;
          }
        }

        const tempAttends = []

        this.selectUser.forEach((item) => {
          tempAttends.push(this.getUserMapItem(item))
        })
        this.formModel.attendees = tempAttends
        this.formModel.attaches = this.files

        const loading = this.$loading();
        // const {error, message} = await addOrEditMeetingDoc(this.formModel.id, {...this.formModel});

        //發起流程
        const postData = {
          processDefinitionKey: "Process_meetingForm",
          moduleKey: "meeting",
          name: this.formModel.docTitle,
          docType: "会议",
          businessData: this.formModel
        };
        const {error, message} = await startMeetingEvent(postData);
        loading.close();
        if (error) this.$message.error(message);
        else this.$emit("success");
        this.$message.success("提交成功");
        await this.$router.push("/meetingManager/doc");
      }
    },

    async onSaveSubmit() {
      this.handleLoading = true
      if (this.$refs.form.validate()) {
        if (this.formModel.meetingBegin === '') {
          this.$message.error("会议开始时间不能为空");
          this.handleLoading = false
          return;
        }
        if (this.formModel.meetingEnd === '') {
          this.$message.error("会议结束时间不能为空");
          this.handleLoading = false
          return;
        }
        this.formModel.meetingBegin = formatDate(this.formModel.meetingBegin, 'yyyy-MM-dd hh:mm')
        this.formModel.meetingEnd = formatDate(this.formModel.meetingEnd, 'yyyy-MM-dd hh:mm')
        if (startBigToEnd(this.formModel.meetingBegin, this.formModel.meetingEnd)) {
          this.$message.error("开始时间不能大于结束时间");
          this.handleLoading = false
          return;
        }

        const isFlag = await this.checkRoomConflict();
        if (isFlag) {
          this.$message.error("会议室该时间段已被占用，请选择其他时间段");
          this.handleLoading = false
          return;
        }

        for (let i = 0; i < this.roomList.length; i++) {
          if (this.roomList[i].roomId === this.formModel.roomId) {
            this.formModel.roomName = this.roomList[i].roomName
            break;
          }
        }

        const tempAttends = []

        this.selectUser.forEach((item) => {
          tempAttends.push(this.getUserMapItem(item))
        })
        this.formModel.attendees = tempAttends
        this.formModel.attaches = this.files

        const loading = this.$loading();
        // const {error, message} = await addOrEditMeetingDoc(this.formModel.id, {...this.formModel});

        //發起流程
        const postData = {
          processDefinitionKey: "Process_meetingForm",
          moduleKey: "meeting",
          name: this.formModel.docTitle,
          docType: "会议",
          businessData: this.formModel
        };
        const {error, message, data} = await startMeetingEvent(postData);
        loading.close();
        if (error) this.$message.error(message);
        else this.$emit("success");
        this.$message.success("保存成功");
        const tempItem = data[0]
        const taskId = tempItem.task.id
        if (!taskId) {
          this.handleLoading = false
          this.$message.error('不存在流程ID，无法处理')
          await this.$router.push("/meetingManager/doc");
        } else {
          await this.$router.push({
            name: "AppFrame",
            query: {
              url: `${getOrigin()}/web/myoa-doc-handler/index.html#/task/complete?id=${taskId}`
            },
          });
        }
      }
    },
  },

};
</script>

<!-- 使新增页面更加规范美观 -->
<style lang="scss" scoped>
.name-item {
  vertical-align: middle;
  margin-top: 5px;
  padding: 0 10px;
  box-sizing: border-box;
}
.uploadBtn {margin-left: calc(50% - 54px)}
.name-item span {
  float: left;
  font-size: 17px;
  color: #666666;
}

.name-del {
  cursor: pointer;
  margin-left: 5px;
  display: inline-block;
  margin-top: 4px;
}

.formTitle {
  text-align: center;
}

.chang-img {
  margin: 0 auto;
}

.btn-box {
  max-width: 800px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: -40px;
  margin-bottom: 20px;
}

.user-box {
  border: 1px solid rgba(0, 0, 0, 0.27);
}

.form {
  max-width: 800px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>

<!-- <style lang="scss" scoped>
@media (max-width: 600px) {
  .col-xs {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
}
</style> -->
