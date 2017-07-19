import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
// 有来抓取歌手数据，拿到歌手列表
export function getSingerList() {
  // 定义一个URL，接口地址
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  // URL所带有的参数
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  // 返回jsonp的方法调用。
  return jsonp(url, data, options)
}
// 获取歌手详情页
export function getSingerDetail(singerId) {
  // 定义一个URL连接
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  // URL中的参数
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  // 返回jsonp方法
  return jsonp(url, data, options)
}
