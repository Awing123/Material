import jwt_decode from 'jwt-decode'

export function getUserInfo(token) {
  return jwt_decode(token)
}

// 生成随机字符串
export function randomString(len = 16) {
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// 获取文件名
export function fileNameFromHeader(disposition) {
  const filenameRegex = /filename[^;=\n]=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);
  if (matches != null && matches[1]) {
    let filename = decodeURI(matches[1].replace(/['"]/g, '').replace('utf-8', ''));
    console.log(filename)
    return filename
  }
  return null;
}

// 检查对象属性是否存在空值
export function isObjectHasEmptyProperty(target = {}, exclusion = []) {
  return Object.keys(target)
    .filter(i => !exclusion.includes(i))
    .map(k => target[k])
    .some(v => !v)
}

// 是否为空对象
export const isEmptyObject = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;

// 下载文件
export async function downloadFile(response) {
  let filename = fileNameFromHeader(response.headers["content-disposition"]);
  let url = window.URL.createObjectURL(new Blob([response.data]));
  let a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  console.log(response)
  a.setAttribute("download", filename.replace(/"/g, ""));
  document.body.appendChild(a);
  a.click(); //执行下载
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

// 把数组分割成N个一组
export function splitArray(list, n = 1) {
  const result = []
  for (let i = 0; i < list.length; i += n) {
    result.push(list.slice(i, i + n))
  }
  return result
}
