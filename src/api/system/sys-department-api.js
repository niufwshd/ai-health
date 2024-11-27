import request from '@/utils/request'

const sysDepartmentApi = {

}

/**
 * 添加部门
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.add = data => {
  return request({
    url: '/sysDepartment/add',
    method: 'post',
    data
  })
}


/**
 * 获取部门
 * @param id
 * @returns {AxiosPromise}
 */
sysDepartmentApi.detail = id => {
  return request({
    url: '/sysDepartment/info/' + id,
    method: 'get'
  })
}
/**
 * 修改部门
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.update = data => {
  return request({
    url: '/sysDepartment/update',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.delete = id => {
  return request({
    url: '/sysDepartment/delete/' + id,
    method: 'post'
  })
}
/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.getList = data => {
  return request({
    url: '/sysDepartment/getList',
    method: 'post',
    data
  })
}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.getDepartmentTree = data => {
  return request({
    url: '/sysDepartment/getDepartmentTree',
    method: 'post',
    data
  })
}

export default sysDepartmentApi

