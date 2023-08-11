<template>
  <div>
    <v-form class="form pb-16" ref="form">
      <div class="formTitle pa-5">
        <h2 v-if="!$vuetify.breakpoint.mobile">{{ title }}</h2>
      </div>
      <v-text-field
          :outlined="false"
          v-model="formModel.roomName"
          v-bind="textFieldProps({ label: '会议室名称' })">
      </v-text-field>
      <v-text-field
          :outlined="false"
          v-model="formModel.roomAddress"
          v-bind="textFieldProps({ label: '会议室地址' })">
      </v-text-field>

      <v-text-field
          :outlined="false"
          v-model="formModel.seatNumber"
          type="number"
          v-bind="textFieldProps({ label: '容纳人数' })">
      </v-text-field>

      <!--          <v-row dense>-->
      <!--            <v-col cols="12" sm="6">-->
      <!--              <v-text-field-->
      <!--                  :outlined="false"-->
      <!--                  v-model="formModel.executeContent"-->
      <!--                  v-bind="textFieldProps({ label: '意见内容' })"-->
      <!--                  :disabled="this.formModel.id">-->
      <!--              </v-text-field>-->
      <!--            </v-col>-->
      <!--            <v-col cols="12" sm="6">-->
      <!--              <v-text-field-->
      <!--                  :outlined="false"-->
      <!--                  v-model="formModel.executeContent"-->
      <!--                  v-bind="textFieldProps({ label: '意见内容' })"-->
      <!--                  :disabled="this.formModel.id">-->
      <!--              </v-text-field>-->
      <!--            </v-col>-->
      <!--          </v-row>-->

      <v-textarea
          style="margin-top:40px"
          outlined
          v-model="formModel.remark"
          label="会议室备注"
      ></v-textarea>
    </v-form>
    <div class="btn-box">
      <v-btn v-if="$vuetify.breakpoint.mobile" block elevation="5" large color="primary" @click="onSave">提交</v-btn>
      <v-btn v-else large color="primary" @click="onSave">提交</v-btn>
    </div>
  </div>
</template>

<script>
import {addOrEditMeeting, getMeetingRoomDetail} from "@/apis/meetingroom";

export default {
  name: "MeetingRoomForm",
  data() {
    return {
      readonly: false,
      formModel: {
        id: "",
        roomName: "",
        roomAddress: "",
        remark: "",
        seatNumber: 0,
      }
    };
  },
  computed: {
    title() {
      return this.formModel.id ? '编辑会议室' : '新增会议室'
    },
  },
  async created() {
    this.formModel.id = this.$route.params.id;
    if (!!this.formModel.id) {
      this.getMeetingRoomDetail();
    }
  },
  methods: {
    getMeetingRoomDetail() {
      getMeetingRoomDetail(this.formModel.id).then(res => {
        this.formModel.roomName = res.data.roomName
        this.formModel.roomAddress = res.data.roomAddress
        this.formModel.seatNumber = res.data.seatNumber
        this.formModel.remark = res.data.remark
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
    async onSave() {
      const loading = this.$loading();
      const {error, message} = await addOrEditMeeting(this.formModel.id, {...this.formModel});
      loading.close();
      if (error) this.$message.error(message);
      else this.$emit("success");
      this.$message.success("提交成功");
      await this.$router.push("/meetingManager/room");
    },
  },
};
</script>

<style lang="scss" scoped>
.formTitle {
  text-align: center;
}

.btn-box {
  max-width: 800px;
  padding: 0 10px;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: -40px;
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

<style lang="scss" scoped>
@media (max-width: 600px) {
  .col-xs {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
}
</style>
