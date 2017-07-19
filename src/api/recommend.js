import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
/* 这是获取数据的API，`推荐`组件中的获取数据的方法,会使用到jsonp.js，因为所用到的url这个借口中有很多重复的参数，所以我们另外写一个文件进行配置config.js文件中
 */
export function getRecommend() {
  // 定义数据的地址，通过jsonp跨域获得数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  /* Object.assign是es6中的方法，在这里是合并这几个对象 ，拼接到上面URL后面的参数 */
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  /* 获取数据的方法，会返回一个promise的函数，在recommennd组件中使用 */
  return jsonp(url, data, options)
}
// 获取列表数据
export function getDiscList() {
  // 请求我们设置的本地代理地址。
  const url = '/api/getDiscList'
  // 公共数据，放在url后面的参数，对象组合
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    // 设置返回对象的格式
    format: 'json'
  })
  // 使用axios进行请求。参数是data
  return axios.get(url, {
    params: data
    // 拿到数据，实际是一个res对象
  }).then((res) => {
    // 返回这个对象
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return jsonp(url, data, options)
}
