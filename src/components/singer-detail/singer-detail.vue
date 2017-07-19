<!-- 歌手详情页 -->
<template>
  <!-- 动画组件 -->
  <transition name="slide">
    <!-- 当前歌手的音乐列表组件 -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  // 引入这个方法
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      // mapGetters映射的是computed，取数据，通过singer来取vuex数据
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      // 歌曲列表，当前歌手的歌曲列表，传入到子组件中
      return {
        songs: []
      }
    },
    // hook函数
    created() {
      // 获取歌手详情页
      this._getDetail()
    },
    methods: {
      // 获取歌手详情页
      _getDetail() {
        // 刷新页面，我们获取不到这个id，singer是从vuex中获取的。
        if (!this.singer.id) {
          // 直接在回退到上一级路由
          this.$router.push('/singer')
          return
        }
        // 调用我们在api目录singer文件中定义的方法
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            // 将我们处理过的歌曲列表返回
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      // 处理歌曲列表，有一个参数
      _normalizeSongs(list) {
        let ret = [];
        // 遍历这个list，拿到每一项
        list.forEach((item) => {
          let {musicData} = item;
          // 如果满足条件，这两个值是必须有的，就将它放入一个新数组
          if (musicData.songid && musicData.albummid) {
            // 采取push一个createSong的实例
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
