import request from '@/utils/request'

const downloadApi = {

}

/**
 * 下载文件
 * @param data
 * @returns {AxiosPromise}
 */
downloadApi.download = id => {
  return request({
    url: '/download/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export default downloadApi
