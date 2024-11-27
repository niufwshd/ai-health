import request from "@/utils/request";

/**
 * 获取字典主表分页数据
 * @param data
 * @returns {AxiosPromise}
 */
export function getDictList(data) {
  return request({
    url: '/sysDict/getPageList',
    method: 'post',
    data: data
  })
}

/**
 * 获取字典明细分页列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getDictItemList(data) {
  return request({
    url: '/sysDictItem/getPageList',
    method: 'post',
    data: data
  })
}
export function addDictItem(data) {
  return request({
    url: '/sysDictItem/add',
    method: 'post',
    data: data
  })
}
export function updateDictItem(data) {
  return request({
    url: '/sysDictItem/update',
    method: 'post',
    data: data
  })
}
export function getDictItemDetail(id) {
  return request({
    url: '/sysDictItem/info/' + id,
    method: 'get',
    param: id
  })
}
export function deleteDictItem(id) {
  return request({
    url: '/sysDictItem/delete/' + id,
    method: 'post',
    param: id
  })
}

/**
 * 根据参数名称查询详情
 * @param id
 * @returns {*}
 */
export function getDictItemByDictName(name) {
  return request({
    url: '/sysDictItem/getDictItemByDictName/' + name,
    method: 'get'
  })
}

export function getAllElementSysDict() {
  return request({
    url: '/sysDict/info-getAllSubList',
    method: 'get'
  })
}
