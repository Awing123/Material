import Vue from 'vue'
import VueRouter from 'vue-router'
import MeetingContainer from "@/views/Meeting/MeetingContainer";
import LayoutContainer from "@/views/Layout/LayoutContainer";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: LayoutContainer,
    redirect: 'workbench',
    children: [
      {
        path: 'frame',
        name: 'AppFrame',
        component: () => import('@/views/Layout/components/AppIframe.vue'),
      }
      ]
  },
  {
    path: '/meetingManager',
    component: MeetingContainer,
    redirect: '/meetingManager/mymeeting',
    children: [
      {
        path: '/meetingManager/room',
        name: 'MeetingRoomList',
        component: () => import('@/views/Meeting/Room/MeetingRoomListView.vue'),
        meta: {
          title: '会议室管理'
        }
      },


      
      {
        path: '/meetingManager/roomform',
        name: 'MeetingRoomForm',
        component: () => import('@/views/Meeting/Room/MeetingRoomForm.vue'),
        meta: {
          title: '新增/会议室'
        }
      },
      {
        path: '/meetingManager/doc',
        name: 'MeetingDocList',
        component: () => import('@/views/Meeting/Doc/MeetingDocListView.vue'),
        meta: {
          title: '会议列表'
        }
      },
      {
        path: '/meetingManager/docform',
        name: 'MeetingDocForm',
        component: () => import('@/views/Meeting/Doc/MeetingDocForm.vue'),
        meta: {
          title: '新增/编辑会议'
        }
      },
       
      
      {
        path: '/meetingManager/docdetail',
        name: 'MeetingDocDetail',
        component: () => import('@/views/Meeting/Doc/MeetingDocDetail.vue'),
        meta: {
          title: '会议详情'
        }
      },
      {
        path: '/meetingManager/mymeeting',
        name: 'MyMeetingList',
        component: () => import('@/views/Meeting/MyMeeting/MyMeetingListView.vue'),
        meta: {
          title: '我的会议'
        }
      },
      {
        path: '/meetingManager/unit',
        name: 'UnitMeetingList',
        component: () => import('@/views/Meeting/Unit/MeetingUnitListView.vue'),
        meta: {
          title: '单位会议'
        }
      },
      {
        path: '/process/:id',
        name: 'ProcessView',
        component: () => import('@/views/Process/ProcessView.vue'),
        meta: {
          title: '流程控制'
        }
      },
      {
        path: '/process-result/:id',
        name: 'ProcessResult',
        component: () => import('@/views/Process/ProcessResult.vue'),
        meta: {
          title: '流程意见'
        }
      },




    
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'hash',
  base: ''
})

export default router
