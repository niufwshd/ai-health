import request from "@/utils/request";

var platformApi = {};

platformApi.upload = function (data) {
  return request({
    url: "/plat/upload",
    method: "post",
    data,
  });
};

platformApi.verno = function (data) {
  return request({
    url: "/plat/verno",
    method: "post",
    data,
  });
};

platformApi.lang = function (data) {
  return request({
    url: "/plat/lang",
    method: "post",
    data,
  });
};

platformApi.zone = function (data) {
  return request({
    url: "/plat/zone",
    method: "post",
    data,
  });
};

platformApi.weather = function (data) {
  return request({
    url: "/plat/weather",
    method: "post",
    data,
  });
};

platformApi.monitor = function (data) {
  return request({
    url: "/plat/monitor",
    method: "post",
    data,
  });
};

platformApi.sos = function (data) {
  return request({
    url: "/plat/sos",
    method: "post",
    data,
  });
};

platformApi.center = function (data) {
  return request({
    url: "/plat/center",
    method: "post",
    data,
  });
};

platformApi.lowbat = function (data) {
  return request({
    url: "/plat/soSms",
    method: "post",
    data,
  });
};

platformApi.remove = function (data) {
  return request({
    url: "/plat/soSms",
    method: "post",
    data,
  });
};

platformApi.removeSms = function (data) {
  return request({
    url: "/plat/removeSms",
    method: "post",
    data,
  });
};

platformApi.cr = function (data) {
  return request({
    url: "/plat/cr",
    method: "post",
    data,
  });
};

platformApi.poweroff = function (data) {
  return request({
    url: "/plat/poweroff",
    method: "post",
    data,
  });
};

platformApi.reset = function (data) {
  return request({
    url: "/plat/reset",
    method: "post",
    data,
  });
};

platformApi.silenceTime2 = function (data) {
  return request({
    url: "/plat/silenceTime2",
    method: "post",
    data,
  });
};

platformApi.walkTime = function (data) {
  return request({
    url: "/plat/walkTime",
    method: "post",
    data,
  });
};

platformApi.sleepTime = function (data) {
  return request({
    url: "/plat/sleepTime",
    method: "post",
    data,
  });
};

platformApi.find = function (data) {
  return request({
    url: "/plat/find",
    method: "post",
    data,
  });
};

platformApi.remind = function (data) {
  return request({
    url: "/plat/remind",
    method: "post",
    data,
  });
};

platformApi.schedule = function (data) {
  return request({
    url: "/plat/schedule",
    method: "post",
    data,
  });
};

platformApi.phb = function (data) {
  return request({
    url: "/plat/phb",
    method: "post",
    data,
  });
};

platformApi.phb2 = function (data) {
  return request({
    url: "/plat/phb2",
    method: "post",
    data,
  });
};

platformApi.phb3 = function (data) {
  return request({
    url: "/plat/phb3",
    method: "post",
    data,
  });
};

platformApi.dphbx = function (data) {
  return request({
    url: "/plat/dphbx",
    method: "post",
    data,
  });
};

platformApi.talk = function (data) {
  return request({
    url: "/plat/talk",
    method: "post",
    data,
  });
};

platformApi.message = function (data) {
  return request({
    url: "/plat/message",
    method: "post",
    data,
  });
};

platformApi.factory = function (data) {
  return request({
    url: "/plat/factory",
    method: "post",
    data,
  });
};

platformApi.flower = function (data) {
  return request({
    url: "/plat/flower",
    method: "post",
    data,
  });
};

platformApi.rcapture = function (data) {
  return request({
    url: "/plat/rcapture",
    method: "post",
    data,
  });
};

platformApi.ppRlease = function (data) {
  return request({
    url: "/plat/ppRlease",
    method: "post",
    data,
  });
};

platformApi.profile = function (data) {
  return request({
    url: "/plat/profile",
    method: "post",
    data,
  });
};

platformApi.realtimeWT = function (data) {
  return request({
    url: "/plat/realtimeWT",
    method: "post",
    data,
  });
};

platformApi.intervalWT = function (data) {
  return request({
    url: "/plat/intervalWT",
    method: "post",
    data,
  });
};

platformApi.btwarnset = function (data) {
  return request({
    url: "/plat/btwarnset",
    method: "post",
    data,
  });
};

platformApi.fixtimeWT = function (data) {
  return request({
    url: "/plat/fixtimeWT",
    method: "post",
    data,
  });
};

platformApi.appLock = function (data) {
  return request({
    url: "/plat/appLock",
    method: "post",
    data,
  });
};

platformApi.hrtstart = function (data) {
  return request({
    url: "/plat/hrtstart",
    method: "post",
    data,
  });
};

platformApi.lSet = function (data) {
  return request({
    url: "/plat/lSet",
    method: "post",
    data,
  });
};

platformApi.falldown = function (data) {
  return request({
    url: "/plat/falldown",
    method: "post",
    data,
  });
};


export default platformApi;
