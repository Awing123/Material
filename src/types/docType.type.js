export const TEST_ORIGIN = 'https://myoa.mmzqoa.net'
export const NOT_DEV_ORIGIN = window.top.location.origin.includes('test.local') ? TEST_ORIGIN : window.top.location.origin
export const MYOA_SYSTEM_CONSOLE = `${window.location.origin}/web/myoa-system-console/index.html`

const TYPES = {
  LEAVE: {
    url: `${MYOA_SYSTEM_CONSOLE}#personnel/leave-detail`,
    iframe: true
  },
  APPEAL: {
    url: `${window.location.origin}/web/myoa-system-console/index.html#personnel/appeal-detail`,
    iframe: true
  },
  CANCEL: {
    url: `${MYOA_SYSTEM_CONSOLE}#personnel/cancel-leave-detail`,
    iframe: true
  },
  CAR: {
    url: `${NOT_DEV_ORIGIN}/web/form-renderer/dist/index.html#/renderer/carApply`,
    iframe: true
  },
  REPORT: {
    url: `${MYOA_SYSTEM_CONSOLE}#personnel/out-report-detail`,
    iframe: true
  },
  BILL: {
    url: '',
    setUrl: ({ url, id }) => `${url}/${id}`,
    iframe: true
  },
}

export const DOC_TYPE = {
  't_doc_leaveform': TYPES.LEAVE,
  't_doc_leavecancel': TYPES.CANCEL,
  't_doc_appeal': TYPES.APPEAL,
  't_doc_car': TYPES.CAR,
  '车辆管理': TYPES.CAR,
  '安装单': TYPES.BILL,
  't_doc_outreport': TYPES.REPORT
}