<!-- 歌手组件 -->
<template>
  <!--  外层为了做滚动，固定父容器的高度 -->
  <div class="singer" ref="singer">
    <!-- 使用我们定义的list-view组件，传递过的数据是data=singers，监听这事件select -->
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!-- 挂载这个自路由，歌手详情页 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  // mapMutations 我们只要引入了，通过...拓展运算符的方式，将Mutations中的方法在method或者computed中进行映射，我们直接进行使用
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  // 定义变量
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        // 定义歌手数据，列表
        singers: []
      }
    },
    created() {
      // 获取歌手列表的方法
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 我们在这执行调到singer-detail组件，然后向路由中添加数据
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 这里调用store中的setSinger。Mutations
        this.setSinger(singer)
      },
      // 定义获取歌手列表
      _getSingerList() {
        // 调用api/singer.js文件中getSingerList的方法，然后会返回数据
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // 通过我们的方法，按照我们的要求格式化歌手列表
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      // 规范化歌手列表数据，分类。在v-for中使用
      _normalizeSinger(list) {
        // 创建一个对象。
        let map = {
          // 人类热门A、B...title是：热门items[]是该分类下的数据
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        // 遍历list，来获取我们所需要的数据
        list.forEach((item, index) => {
          // 如果是前十条就是热门数据
          if (index < HOT_SINGER_LEN) {
            // Singer是我们封装的一个类，只需要传入id和name
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              // 这个id是用来获取头像的。
              id: item.Fsinger_mid,
              // 拼接头像的地址
              // avatar:""
            }))
          }
          // 拿到Findex
          const key = item.Findex
          // 先判断我们去到的map中没有Findex
          if (!map[key]) {
            // 如果没有就创建一个map对象
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
          // console.log(map)
        })
        // 将这个变成一个有序的数组,让他按照abc的顺序来排列。为了得到有序列表，我们需要处理 map
        // ret放置a-z的数据
        let ret = []
        // 放置hot热门的数据
        let hot = []
        // 先遍历
        for (let key in map) {
          // 然后拿到map的每一个元素。
          let val = map[key]
          // 正则校验每一个元素的title，如果是a-z中的，就放到数组中
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
            // 如果这个title是HOT_NAME，单独push到hot数组中
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        // 数组的sourt方法，按照字母的升序排列。
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      // ...mapMutations,就会拿到所所有的Mutations，然后自己设置值做对应，在调用的时候直接使用this.setSinger进行调用就行了，实现了我们对一个Mutations的提交
      // mapMutations映射的是methods
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
