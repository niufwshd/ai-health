import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  return request({
    url: "/getSysUserInfo",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

export function queryTaskCount(data) {
  return request({
    url: "/busiOrder/queryTaskCount",
    method: "post",
    data,
  });
}

export function indexOrderList(data) {
  return request({
    url: "/busiOrder/indexOrderList",
    method: "post",
    data,
  });
}

export function getVerificationCode() {
  return request({
    url: "/verificationCode/getBase64Image",
    method: "get",
  });
}
