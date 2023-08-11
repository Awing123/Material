<template>

  <v-card flat tile class="no-top-bottom-height">
    <v-overlay :value="showSearchBox" :z-index="99999" @click="showSearchBox = false"></v-overlay>
    <div class="search-box" v-if="showSearchBox">
      <v-row dense>
        <v-col cols="12" sm="12">
          <v-text-field
              dense
              outlined
              clearable
              v-model="docTitle"
              label="会议名称">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="5" sm="5">
          <v-btn
              outlined
              block
              @click="clear()"
              color="indigo"
          >
            清空
          </v-btn>
        </v-col>
        <v-col cols="2" sm="2">

        </v-col>
        <v-col cols="5" sm="5">
          <v-btn
              depressed
              block
              @click="search()"
              color="primary"
          >
            搜索
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!--下拉刷新-->
    <vue-loadmore
        :on-refresh="onRefresh"
        :on-loadmore="onLoadMore"
        :finished="lastPage">
      <div class="opinion-list">
        <div class="opinion-item" v-for="(item, index) of list" @click="toDetail(item)" :key="index">
          <span class="opinion-title">{{item.docTitle}}</span>

          <div class="meeting-info">
            <span class="meeting-time">时间: {{item.meetingBegin}} ~ {{item.meetingEnd}}</span>
          </div>
          <div class="meeting-info">
            <span class="meeting-time">会议室: {{item.roomName}}</span>
          </div>
          <div class="opinion-content">
            <span class="opinion-time">{{item.createTime}}</span>
          </div>
        </div>
      </div>
    </vue-loadmore >
    <!--底部tab-->
    <BottomNavigation :activeIndex="2"/>
    <!--浮动菜单-->
    <div id="create">
      <v-speed-dial
        v-model="fab"
        :fixed="true"
        :top="top"
        :bottom="bottom"
        :right="right"
        :left="left"
        :direction="direction"
        :open-on-hover="hover"
        :transition="transition"
    >
      <template v-slot:activator>
        <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-menu
          </v-icon>
        </v-btn>
      </template>
      <v-btn
          fab
          dark
          small
          @click="toSearch()"
          color="green"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-speed-dial>
    </div>

  </v-card>

</template>

<script>
import { getUnitMeetingList} from "@/apis/unitmeeting";
import BottomNavigation from "../components/BottomNavigation.vue"
import {isFlutter} from "@/utils/desktop";
export default {
  name: "MobileMeetingUnitList",
  components: {
    BottomNavigation
  },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      lastPage: false,
      docTitle:'',


      direction: 'top',
      fab: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
      dialog: false,

      id:'',
      executeContent:'',
      share: false,
      rank:'',
      items: [
        { text: '编辑常用意见', icon: 'mdi-pencil' },
        { text: '共享常用意见', icon: 'mdi-share' },
        { text: '不共享常用意见', icon: 'mdi-undo' },
        { text: '删除常用意见', icon: 'mdi-delete' },
        { text: '取消', icon: 'mdi-cancel' },
      ],
      showSearchBox: false,
    };
  },
  mounted() {
    if (isFlutter()) {
      this.getPage()
    }
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
          this.getPage()
        }
      }
    },
    /**
     * 分页数据接口
     */
    async getPage() {
      if (this.lastPage) return;
      let res = await getUnitMeetingList({
        currentPage: this.page,
        pageSize: this.pageSize,
        docTitle: this.docTitle
      })
      let list = res.data.content
      this.list = this.page === 1 ? list : this.list.concat(...list)
      this.lastPage = res.data.last
    },
    async onRefresh(done) {
      this.page = 1
      this.lastPage = false
      await this.getPage()
      done()
    },
    async onLoadMore(done) {
      this.page++
      await this.getPage()
      done()
    },
    toDetail(meeting) {
      this.$router.push({
        name: 'MeetingDocDetail',
        query: {
          docId: meeting.id,
          unit: true,
        }
      })
    },
    toSearch() {
      this.showSearchBox = true
    },
    clear() {
      this.docTitle = ''

      this.page = 1
      this.lastPage = false
      this.getPage()
    },
    search() {
      this.showSearchBox = false
      this.page = 1
      this.lastPage = false
      this.getPage()
    }
  },
};
</script>
<style>
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: fixed;
  bottom: 90px;
}

#create .v-btn--floating {
  position: relative;
}
</style>
<style lang="scss">

.search-box {
  width: 100%;
  height: 180px;
  background: #FFFFFF;
  position: fixed;
  z-index: 100000;
  border-bottom: 1px solid #ededed;
  padding: 15px;
  box-sizing: border-box;
}

.opinion-list {
  padding: 10px 15px 15px 15px;
  box-sizing: border-box;
  .opinion-item {
    border-bottom: 1px solid #ededed;
    padding: 10px 0;
    .opinion-title {
      font-size: 16px;
      color: #333333;
    }
    .meeting-info {
      margin-top: 5px;
      font-size: 15px;
      color: #666666;
      .meeting-room {
        margin-left: 15px;
      }
    }
    .opinion-content {
      margin-top: 5px;
      font-size: 14px;
      color: #999999;
      .opinion-time {

      }
      .opinion-type {
        margin-left: 15px;
      }
      .opinion-public {
        color: #FFFFFF;
        float: right;
        background: #4CAF50;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 5px;
      }
      .opinion-unpublic {
        background: #9E9E9E;
      }
    }
  }
}

</style>
