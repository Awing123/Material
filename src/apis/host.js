const iAuth_prod = "https://auth.mmzqoa.net"
const iAuth_dev = "https://iauth.mmzqoa.net:30443"

const isProd = window.location.host === 'myoa.mmzqoa.net'
export const iAuth_host = isProd ? iAuth_prod : iAuth_dev