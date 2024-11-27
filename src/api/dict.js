import request from '@/utils/request'

let sysDictApi = {};

sysDictApi.getDictItemData =  (data) => {
  return request({
    url: '/sysDictItem/getPageList',
    method: 'post',
    data
  })
  
}


sysDictApi.getDictData =  (data) => {
  return request({
    url: '/sysDict/getData',
    method: 'post',
    data
  })
  
}

export default sysDictApi;


