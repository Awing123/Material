<template>
  <v-card flat tile>
    <v-card-title> 重设密码 </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              label="原密码[currentPassword]"
              v-model="modelData.currentPassword"
              :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showCurrentPassword ? 'text' : 'password'"
              @click:append="showCurrentPassword = !showCurrentPassword"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              label="新密码[password]"
              v-model="modelData.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              label="确认新密码[confirmPassword]"
              v-model="modelData.confirmPassword"
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPassword ? 'text' : 'password'"
              @click:append="showConfirmPassword = !showConfirmPassword"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="onCancel">取消</v-btn>
      <v-btn color="primary" @click="onSave">保存</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  model: {
    prop: "data",
    event: "updateData",
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showCurrentPassword: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    modelData: {
      get() {
        return this.data;
      },
      set(newValue) {
        this.$emit("updateData", newValue);
        return newValue;
      },
    },
  },
  methods: {
    onSave() {
      this.$emit("save");
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style></style>
