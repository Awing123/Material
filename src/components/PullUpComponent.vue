<template>
  <v-card flat tile class="pullup">
    <div ref="scroll" class="pullup-wrapper">
      <div class="pullup-content">
        <slot></slot>

        <div class="pullup-tips">
          <div v-if="!isPullUpLoad" class="before-trigger">
            <span class="pullup-txt">{{ noMore ? noMoreText : moreText }}</span>
          </div>
          <div v-else class="after-trigger">
            <span class="pullup-txt">{{ loadingText }}...</span>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";

BScroll.use(Pullup);

export default {
  data() {
    return {
      isPullUpLoad: false,
      data: [],
    };
  },
  props: {
    noMore: {
      type: Boolean,
      default: false,
    },
    refreshData: {
      type: Function,
      require: true,
    },
    moreText: {
      type: String,
      default: "上拉加载更多",
    },
    noMoreText: {
      type: String,
      default: "已经全部加载",
    },
    loadingText: {
      type: String,
      default: "加载中",
    },
  },
  mounted() {
    this.initBscroll();
  },
  updated() {
    this.bscroll.refresh();
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.scroll, {
        pullUpLoad: true,
        click: true,
        tap: true,
      });

      this.bscroll.on("pullingUp", this.pullingUpHandler);
    },
    async pullingUpHandler() {
      if (this.noMore) return;
      this.isPullUpLoad = true;

      await this.refreshData();

      this.bscroll.finishPullUp();
      this.bscroll.refresh();
      this.isPullUpLoad = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pullup {
  height: 100%;
  .pullup-wrapper {
    height: 100%;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .pullup-list {
    padding: 0;
  }
  .pullup-list-item {
    list-style: none;
    border-bottom: 1px solid #ccc;
  }
  .pullup-tips {
    padding: 20px;
    text-align: center;
    color: #999;
  }
}
</style>
