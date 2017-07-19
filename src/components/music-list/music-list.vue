<!-- 音乐列表组件 -->
<template>
  <div class="music-list">
    <!-- 点击按钮返回上一页 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 播放按钮，当我们滚动的顶部的时候，隐藏这个按钮，拉下来的时候显示这个按钮 -->
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 添加一个层，达到一定的效果，当我们滚动的时候，它向上偏移 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 使用scroll滚动 -->
    <scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
            <!-- 为了控制内部的样式 -->
      <div class="song-list-wrapper">
        <!-- 传递参数，接收子组件派发的事件select -->
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <!-- 数据是异步获取，所以会有一个加载的过程，所以添加一个loading组件 -->
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import {playlistMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'
// 预留一个高度
  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [playlistMixin],
    // 需要接收的数据
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 维护一个纵向滚动的值
        scrollY: 0
      }
    },
    computed: {
      // 通过计算属性设置背景图片
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    created() {
      // 设置better-scroll支持滚动
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 向上的滚动预留的一个高度
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      // 控制scroll的高度为当前背景图的高度
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 在滚动的时候实时的给y赋值
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      // 这里音乐播放，两个参数，使用actios中的方法
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      // 拿到vuex中封装的方法
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      // 监听这个scrollY，每次被赋值都会触发。
      scrollY(newVal) {
        // 设置一个最大的滚动量
        let translateY = Math.max(this.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        // 下拉歌曲列表图片发生变化
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }

        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (newVal < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      Scroll,
      Loading,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
