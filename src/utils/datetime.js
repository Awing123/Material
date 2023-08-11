// 日期格式化fmt
export function formatDate(date, fmt) {
  if (!date) return ''
  // 如果date不是日期类型先转换
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

export function startBigToEnd(startTime, endTime) {
  const startArray = startTime.split(" ");
  const startDateArray = startArray[0].split("-");
  const startTimeArray = startArray[1].split(":");

  const startDate = new Date(startDateArray[0], startDateArray[1], startDateArray[2], startTimeArray[0], startTimeArray[1]);
  const start = startDate.getTime();

  const endArray = endTime.split(" ");
  const endDateArray = endArray[0].split("-");
  const endTimeArray = endArray[1].split(":");

  const endDate = new Date(endDateArray[0], endDateArray[1], endDateArray[2], endTimeArray[0], endTimeArray[1]);
  const end = endDate.getTime();
  return start > end
}


function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
