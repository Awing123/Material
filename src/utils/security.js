import CryptoJS from "crypto-js";
import urlencode from "urlencode";
import { JSEncrypt } from "jsencrypt";

const AES_KEY = "ASE_KEY_20160428";
const IV_STRING = "0102030405060708";
// 公钥key
const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDi8Fy6tQoIZIaPfUXsuGGfrrpqOKMB752O0oG7BRHq0vLCeJocJ5Nr1OZ6ZqOrUpprnCBnW8qJ8gYqlXiPS8uW1e8H9XgQLY + ZHCYAJVWoWkG56gA + O / S2MhcKQSgDo + aB4OCzvdrWViv6Jy4DaLiGpNuxAMSGtBiRzuqXqcRfVwIDAQAB";

export default {
  urlEncode(word, encoding) {
    let keyStr = urlencode.encode(word, encoding);
    return keyStr;
  },
  urlDecode(word, encoding) {
    let keyStr = urlencode.decode(word, encoding);
    return keyStr;
  },
  //随机生成指定数量的16进制key
  generatekey(num) {
    let library =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (var i = 0; i < num; i++) {
      let randomPoz = Math.floor(Math.random() * library.length);
      key += library.substring(randomPoz, randomPoz + 1);
    }
    return key;
  },

  //加密
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : AES_KEY; //判断是否存在ksy，不存在就用定义好的key
    // keyStr = AES_KEY;
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  //解密
  decrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : AES_KEY;
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  OAEncrypt(word) {
    let key = "密钥要后后台一致";
    let iv = "偏移量要个后台一致";

    key = CryptoJS.enc.Utf8.parse(AES_KEY);
    iv = CryptoJS.enc.Utf8.parse(IV_STRING);

    let srcs = CryptoJS.enc.Utf8.parse(word);
    // 加密模式为CBC，补码方式为PKCS5Padding（也就是PKCS7）
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    //返回base64
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  },
  OADecrypt(word) {
    let key = "密钥要后后台一致";
    let iv = "偏移量要个后台一致";
    key = CryptoJS.enc.Utf8.parse(AES_KEY);
    iv = CryptoJS.enc.Utf8.parse(IV_STRING);
    word = word.replace(/\s*/g, "");
    let base64 = CryptoJS.enc.Base64.parse(word);

    let src = CryptoJS.enc.Base64.stringify(base64);

    // 解密模式为CBC，补码方式为PKCS5Padding（也就是PKCS7）
    let decrypt = CryptoJS.AES.decrypt(src, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
  /* JSEncrypt加密 */
  rsaPublicData(data) {
    let jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(publicKey);
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    let result = jsencrypt.encrypt(data);
    return result;
  },
  SHA256(data) {
    CryptoJS.SHA256(data)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();
  },
  OAEncryptJson(jsonData) {
    var res = {};
    for (var key in jsonData) {
      res[key] = this.OAEncrypt(jsonData[key]);
    }
    return res;
  },
  OADecryptJson(jsonData) {
    const res = {};
    for (var key in jsonData) {
      res[key] = this.OADecrypt(jsonData[key]);
    }
    return res;
  },
  OAEncryptObject(obj) {
    const result = {}
    Object.keys(obj).forEach(key => result[key] = this.OAEncrypt(obj[key]))
    return result
  },
  formatRes(res) {
    if (!res.data) return res
    // 解密和格式化数据内容
    let decrypt_res = this.OADecrypt(res.data),
      decode_res = this.urlDecode(decrypt_res, "UTF-8"),
      json_res = JSON.parse(decode_res)
    return {
      ...res,
      data: json_res
    }
  }
};
