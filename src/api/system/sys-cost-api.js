import request from "@/utils/request";

const sysCostApi = {

}

sysCostApi.getPageList = data => {
  return request({
    url: '/sysCost/getPageList',
    method: 'post',
    data
  })
}

sysCostApi.add = data => {
  return request({
    url: '/sysCost/add',
    method: 'post',
    data
  })
}

sysCostApi.update = data => {
  return request({
    url: '/sysCost/update',
    method: 'post',
    data
  })
}

sysCostApi.detail = id => {
  return request({
    url: '/sysCost/info/' + id,
    method: 'get'
  })
}

sysCostApi.delete = id => {
  return request({
    url: '/sysCost/delete/' + id,
    method: 'post'
  })
}


export default sysCostApi
