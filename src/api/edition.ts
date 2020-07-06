import request from '@/utils/request'
// 从指定服务器下载目录文件
export function dowloadDir(query: object) {
  return request({
    url: '/edition/downloadDir',
    method: 'get',
    params: query
  })
}
// 获取所有版本配置列表
export function getEditionLists() {
  return request({
    url: '/edition/getEditionLists',
    method: 'get'
  })
}
// 生成版本本地打包文件
export function getEditionPage(params: object) {
  return request({
    url: '/edition/getEditionPage',
    method: 'get',
    params
  })
}
// 更新当前版本配置
export function updateEditionItem(params: object) {
  return request({
    url: '/edition/updateEditionItem',
    method: 'post',
    data: params
  })
}
// 新增版本配置
export function addEditionItem(params: object) {
  return request({
    url: '/edition/addEditionItem',
    method: 'post',
    data: params
  })
}
// 删除版本配置
export function deleteEditionItem(params: object) {
  return request({
    url: '/edition/deleteEditionItem',
    method: 'get',
    params
  })
}
// 上传文件至服务器
export function uploadPagefile(params: object) {
  return request({
    url: '/edition/uploadPagefile',
    method: 'post',
    data: params
  })
}
// 执行发版服务shell代码进行发版
export function setServise(params: object) {
  return request({
    url: '/edition/setServise',
    method: 'get',
    params
  })
}
