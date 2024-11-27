import request from '@/utils/request'

const uploadApi = {

}

/**
 * 上传文件
 * @param data
 * @returns {AxiosPromise}
 */
uploadApi.upload = data => {
  return request({
    url: '/upload/image',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 上传多文件
 * @param data
 * @returns {AxiosPromise}
 */
uploadApi.uploads = data => {
  return request({
    url: '/upload/images',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default uploadApi
