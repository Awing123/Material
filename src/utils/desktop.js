// 获取 client 对象
export const getClient = () => window.top.client || window.top.phone || window.top.desktop || {}

// 获取token
export const getToken = async () => {
  let accessToken = ""
  let client = getClient()
  let getTokenFun = client.getToken || client.getUserAccessToken || client.getAccessToken
  if (client) {
    accessToken = await getTokenFun()
    localStorage.setItem('accessToken', accessToken)
  } else {
    accessToken = localStorage.getItem('accessToken') || ""
  }
  return accessToken

  // return "eyJraWQiOiI5ZWQzNmI5ZC02NzIzLTRiZTAtOWU1Mi1mMjM1Mjc4YTYzMDQiLCJhbGciOiJSUzI1NiJ9.eyJzeXNBcmVhIjpmYWxzZSwic3ViIjoiMTc4NzY1MTQyNTgiLCJlbXBJZCI6IjU0ZmMxYTc1LTkwNjQtNGJiMC1iZWU0LTE0N2ExNDczNWYyMSIsInJvbGVzIjpbIlJPTEVfT1JHX1VTRVIiXSwiaXNzIjoiaHR0cHM6XC9cL2F1dGgubW16cW9hLm5ldCIsInN5c09yZyI6ZmFsc2UsInVzZXJJZCI6IjBkYzhjYmY5LWI1ZDAtNDFiZS1iYzUwLWQzNzkzOTUxNTQ1NiIsImRlcE5hbWUiOiLns7vnu5_pm4bmiJDojILlkI3lhazlj7giLCJvcmdJZCI6ImY1YzNhMDkwLTYyYzgtNGQ2ZS04ZTVmLTZhMTdiZWYxNzEwNiIsImF1ZCI6InVzZXI6MGRjOGNiZjktYjVkMC00MWJlLWJjNTAtZDM3OTM5NTE1NDU2OnRlc3QiLCJuYmYiOjE2NzU4MTk0NzEsImFyZWFJZCI6ImVkOTFhMTI3LTQ5ZGUtNGJhZS1iYjEzLTliN2ZmMmExNTY0MCIsInNjb3BlIjpbIm9wZW5pZCJdLCJlbXBOYW1lIjoi6LCi5rC45a2mIiwic3lzRGVwIjpmYWxzZSwiZGVwSWQiOiJmODA3ZTc1OS05ODk5LTRjYWUtODVmYS1iNjUyNmU1OTIwZGQiLCJleHAiOjE2NzU4MTk1OTEsImlhdCI6MTY3NTgxOTQ3MX0.i_uFEMYMFzdiYeIydyTYTDLWcq7cE6sb0lZ5gTX8Xx69t5dsYVGYuYVZIj_Hcxa8WBdvNBLYdOt9ORx0pfhqBHYxgkpMKQMSsiSLa4WMB87ZBfM-rF88OiY19KX4CjV6sP6B4pwbGbKGmLtyYXGApr-9ywIJG6Ie6AB9vpFJcNHkVkpxMfTVsTvKqjjQug2J2qyox4Cl1rAaeQUlKI_JmkwVvpBCGtjnkhgejTdQ2xZG5un3Pg0q16Vb6xeaFf6OGjFQKMj4gipZtqX9z_vFVqb0h7Kz6gyOicZ_jayEjlH7YW0pmV1mWsfhWRH-dZz0uLj0CgtNkE1lGVvpY8KNfg"
}


export const isFlutter = () => {
  return navigator.userAgent.match(/(flutter)/gi)
}

// 获取用户信息
export const loadUserInfo = () => {
  return getClient().loadUserInfo()
}

// token失效，刷新父窗口
export const refreshToken = () => {
  if (!window.parent[0]) return false;

  const { setItem, removeItem } = window.parent.localStorage

  removeItem('accessToken'); // 清除父窗口的token
  setItem('parentRedirectUrl', window.parent.location); // 缓存父窗口路由
  setItem('iframeRedirectUrl', window.location.href); // 缓存子窗口路由

  const client = getClient()
  if (client.logout) client.logout()
  else window.parent.location.reload();

}

export const closeBrowser = () => {
  if (!window.webkit) return;
  let message = "browser_close";
  let messageObj = {
    type: message,
  };
  let stringifiedMessageObj = JSON.stringify(messageObj);
  window.webkit.messageHandlers.cordova_iab.postMessage(
    stringifiedMessageObj
  );
}
