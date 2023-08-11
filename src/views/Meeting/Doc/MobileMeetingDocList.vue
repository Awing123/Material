<!-- 会议室管理主页面 -->

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
              label="标题">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="12">
          <v-text-field
              dense
              clearable
              outlined
              v-model="message"
              label="会议内容">
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
      <div class="notice-list">
        <div class="notice-item" v-for="(item, index) of list" @click="toDetail(item.id)" @touchstart="showDialog(item.id)" @touchend="clearLoop(item.id)" :key="index">
          <span class="notice-title">{{item.docTitle}}</span>
          <div class="meeting-info">
            <span class="meeting-time">时间: {{item.meetingBegin}} ~ {{item.meetingEnd}}</span>
          </div>
          <div class="meeting-info">
            <span class="meeting-time">会议室: {{item.roomName}}</span>
          </div>
          <div class="notice-content">
            <span class="notice-time">{{item.createTime}}</span>
            <span v-if="item.useState === '1'" class="notice-public">已发布</span>
            <span v-else class="notice-public notice-unpublic">未发布</span>
          </div>
        </div>
      </div>
    </vue-loadmore >
    <!--底部tab-->
    <BottomNavigation  :activeIndex="1"/>
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
      <v-btn
          fab
          dark
          small
          @click="toAdd()"
          color="indigo"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-speed-dial>
    </div>
    <!--长按弹框-->
    <v-dialog v-model="dialog">
      <v-list flat>
        <v-list-item-group color="indigo">
          <v-list-item
              v-for="(item, i) in items"
              :key="i"
              @click="handleMenu(i)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-dialog>
  </v-card>

</template>

<script>
import {getMeettingDocList, deleteDocList} from "@/apis/meetingdoc";
import BottomNavigation from "../components/BottomNavigation"
import {isFlutter} from "@/utils/desktop";
export default {
  name: "MobileMeetingDocList copy",
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
      message: '',

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
      items: [
        { text: '编辑会议', icon: 'mdi-pencil' },
        { text: '删除会议', icon: 'mdi-delete' },
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
      let res = await getMeettingDocList({
        currentPage: this.page,
        pageSize: this.pageSize,
        docTitle: this.docTitle,
        message: this.message
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
    toDetail(id) {
      this.$router.push({
        name: 'MeetingDocDetail',
        query: {
          docId: id,
          unit: false
        }
      })
    },
    toAdd() {
      this.$router.push("/meetingManager/docform");
    },
    toSearch() {
      this.showSearchBox = true
    },
    showDialog(id) {
      this.id = id
      clearTimeout(this.Loop);
      this.Loop = setTimeout(function() {
        this.dialog = true
      }.bind(this), 1000);
    },
    clearLoop(id) {
      this.id = id
      clearTimeout(this.Loop);
    },
    handleMenu(i) {
      this.dialog = false
      if (i === 0) {
        this.$router.push({
          name: 'MeetingDocForm',
          params: {
            id: this.id
          }
        })
      } else if (i === 1) {
        this.deleteMeeting()
      }
    },

    deleteMeeting() {
      this.$confirm({
        title: '确认删除?',
        content: '删除后，您将无法恢复！',
        icon: 'warning'
      }).then(()=>{
        deleteDocList(this.id).then(res => {
          if (!res.error) {
            this.$message.success('删除成功')
            this.page = 1
            this.lastPage = false
            this.getPage()
          } else {
            this.$message.error(res.message)
          }
        })

      }).catch(()=>{
        console.log("cancel");
      })
    },
    clear() {
      this.docTitle = ''
      this.message = ''

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
  height: 240px;
  background: #FFFFFF;
  position: fixed;
  z-index: 100000;
  border-bottom: 1px solid #ededed;
  padding: 15px;
  box-sizing: border-box;
}

.notice-list {
  padding: 10px 15px 15px 15px;
  box-sizing: border-box;
  .notice-item {
    border-bottom: 1px solid #ededed;
    padding: 10px 0;
    .notice-title {
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
    .notice-content {
      margin-top: 5px;
      font-size: 14px;
      color: #999999;
      .notice-time {

      }
      .notice-type {
        margin-left: 15px;
      }
      .notice-public {
        color: #FFFFFF;
        float: right;
        background: #4CAF50;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 5px;
      }
      .notice-unpublic {
        background: #9E9E9E;
      }
    }
  }
}

</style>
