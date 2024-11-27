import request from '@/utils/request'

const sysOperationLogApi = {

}



/**
 * 业务操作日志
 * @param data
 * @returns {AxiosPromise}
 */
sysOperationLogApi.getPageList = data => {
  return request({
    url: '/tmsOrderOperationLog/getPageList',
    method: 'post',
    data
  })
}

export default sysOperationLogApi
