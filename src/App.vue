<template>
  <router-view :key="key"></router-view>
  <!-- key的作用主要是为了高效的更新虚拟DOM -->
</template>

<script>
export default {
  name: "App",
  computed: {
    key() {
      return this.$route.path;
    },
  },
  mounted() {
    window._this = this;
    let _this = this;
    _this.alert = false;
    let timeOut_handle;
    // _this只是一个变量名，this代表父函数，如果在子函数还用this，this的指向就变成子函数了，_this就是用来存储指向的

    const window_alert = (alertText, type, timeOut = 3) => {
      _this.alert = true;
      _this.alertText = alertText;
      _this.type = type;
      if (timeOut_handle) clearTimeout(timeOut_handle);
      timeOut_handle = setTimeout(() => {
        _this.alert = false;
      }, timeOut * 1000);
    };

    window.alert = function (alertText, timeOut) {
      window_alert(alertText, "success", timeOut);
    };
    // window.alert() 令浏览器显示一个带有可选的信息的对话框，并等待用户离开该对话框

    window.warning = function (alertText, timeOut) {
      window_alert(alertText, "warning", timeOut);
    };

    window.error = function (alertText, timeOut) {
      window_alert(alertText, "error", timeOut);
    };


    // window.confirm() 令浏览器显示一个带有可选的信息的对话框，并等待用户确认或取消该对话框
    window.confirm = function (confirmText) {
      _this.confirmModel = true;
      _this.confirmText = confirmText;

      return new Promise(function (resolve) {
        _this.$on("confirm", () => {
          resolve(true);
        });
        _this.$on("cancel", () => {
          resolve(false);
        });
      });
    };

    // window.prompt() 指示浏览器显示一个对话框，其中有一个可选的信息，提示用户输入一些文本，并等待用户提交文本或取消对话框。
    window.myprompt = function (promptText) {
      _this.promptModel = true;
      _this.promptText = promptText;
      _this.inputText = null;

      return new Promise(function (resolve) {
        _this.$on("confirm", () => {
          resolve(_this.inputText);
        });
        _this.$on("cancel", () => {
          resolve(false);
        });
      });
    };

    let timeOutHandle;
    //加载中转圈圈
    window.loading = (loading_close, isRouteLoading) => {
      if (!loading_close) {
        _this.loading = true;
        _this.loading_list.push(1);
      }

      if (timeOutHandle) clearTimeout(timeOutHandle);
      timeOutHandle = setTimeout(() => {
        if (!loading_close) {
          _this.loading = false;
          window.warning("加载超时");
        }
        // 如果不是路由加载（是网络请求），则触发列表加载完毕事件
        if (!isRouteLoading) Store.$emit("request_error");
      }, _this.timeOut * 1000);
    };
    window.loaded = (loading_close) => {
      if (!loading_close) {
        _this.loading_list.pop();
        if (_this.loading_list.length == 0) _this.loading = false;
      }
      clearTimeout(timeOutHandle);
    };

    window.onscroll = () => {
      if (window.scrollY >= window.innerHeight * 0.2) _this.toTop = true;
      else _this.toTop = false;
    };
  },
  data: () => ({
    alert: false,
    alertText: "",
    confirmModel: false,
    confirmText: "",
    promptModel: false,
    promptText: "",
    inputText: null,
    loading: false,
    type: "success",
    timeOut: 10, //加载超时设定
    alert_fullScreen: false,
    toTop: false,

    loading_list: [],
  }),
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    cancel() {
      this.confirmModel = false;
      this.promptModel = false;
      this.$emit("cancel");
    },
    confirm() {
      this.confirmModel = false;
      this.promptModel = false;
      this.$emit("confirm");
    },
  },
};
</script>
