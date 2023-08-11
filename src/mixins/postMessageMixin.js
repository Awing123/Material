export default {
  data() {
    return {
      useMessage: true // 是否使用postMessage
    }
  },
  async mounted() {
    if (this.useMessage) {
      window.addEventListener("message", this.handleMessage);
    } else {
      this.messageCallback();
    }
  },
  destroyed() {
    window.removeEventListener("message", this.handleMessage);
  },
  methods: {
    messageCallback() { console.log('未在业务实现messageCallback方法') },
    async handleMessage(event) {
      if (typeof event.data !== "string" || event.data.constructor !== String)
        return;
      const data = JSON.parse(event.data);
      if (data && data.type === "loadstop") {
        this.messageCallback();
      }
    },
  }
}