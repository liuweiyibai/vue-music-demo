import Vue from 'vue'
import Router from 'vue-router'
/* vuerouter的配置文件，使用vue.use这个路由 */
Vue.use(Router)
// 分别定义这些组件。
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}
/* 路由的配置path是路径，redirect是路由重定向。component是对应的组件,children是这个组件下能切换的子组件 */
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          // 传入不同的id，以便调到不同的歌手详情页
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
