import request from '@/utils/request'

const sysAuthBookLogApi = {

}

/**
 * 授权日志
 * @param data
 * @returns {AxiosPromise}
 */
sysAuthBookLogApi.getPageList = data => {
  return request({
    url: '/sysAuthBookLog/getPageList',
    method: 'post',
    data
  })
}

export default sysAuthBookLogApi
