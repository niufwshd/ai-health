import request from "@/utils/request";

var platformT1Api = {};

platformT1Api.sendCmd4T1 = function (data) {
  return request({
    url: "/plat/sendCmd4T1",
    method: "post",
    data,
  });
};

export default platformT1Api;
