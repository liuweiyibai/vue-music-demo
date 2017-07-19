//  定义一些公共参数，为了我们不必要每一次请求都去写这些参数，，只需要引入一个文件，这里配置的是recommend文件中jsonp跨域的地址的参数
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback'
}
// 通常的配置
export const ERR_OK = 0

/* 这个文件中配置jsonp跨域中的几个重复固定的参数配置 ，被api/recommend.js所使用 */
