<!-- 一个类通讯录的组件，用来显示歌手列表 -->
<template>
  <!-- 组件是可以滚动的 ，所以使用到scroll组件，data传递过去，scroll组件监听这个data，会进行初始化，scroll会派发一个scroll事件出来，我们在这里监听这个事件，拿到它的位置-->
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview">
    <ul>
      <!-- 遍历这个data，(title&items) -->
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <!-- 遍历每一个字母下的列表。 -->
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <!-- 图片懒加载 -->
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!-- 右侧的列表，字母快速入口 -->
    <!-- 添加touch事件，这个快速如入口不能使用scroll组件 -->
    <div class="list-shortcut"
     @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <!-- 固定的标题位置，根据跳到不同的位置，根据currentIndex计算显示内部的文字 ，是否显示和隐藏取决于fixedTitle是否返回了文字-->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
    // 接收一些数据
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 获取右侧快速入口的列表
      shortcutList() {
        // 遍历传递过来的data值。
        return this.data.map((group) => {
          // 截取每一个元素的title的第一位
          return group.title.substr(0, 1)
        })
      },
      // 计算固定的标题的位置
      fixedTitle() {
        // 边界条件
        if (this.scrollY > 0) {
          return ''
        }
        // 返回currentIndex位置的文字。
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      // 设置scroll为不截留的滚动
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      // 派发出一个事件，告诉外部我被点击了，我传递了触发我的元素
      selectItem(item) {
        this.$emit('select', item)
      },
      // 点击开始事件，遍历的时候拿到index。
      onShortcutTouchStart(e) {
        // 获取e.target上的data-index，并且存储
        let anchorIndex = getData(e.target, 'index')
        //获取第一个触碰到的手指的位置
        let firstTouch = e.touches[0]
        // 存储这个值。
        this.touch.y1 = firstTouch.pageY
        // 记录你当前点击的是第几个索引
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },
      // 监听touchmove事件，如果右侧字母列表在滚动，右侧歌手列表页在滚动
      onShortcutTouchMove(e) {
        // 获取第一个触碰到的手指的位置
        let firstTouch = e.touches[0]
        // 保存手指的位置y坐标，这个值要在多个函数中共享，所以设置为公用的值
        this.touch.y2 = firstTouch.pageY
        // delta计算偏移了几个锚点，|0  可以理解为向下取整
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // 为什么使用parseint，因为数字加字符串的问题
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        // 滚动到当前索引
        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      // 监听scroll组件的scroll事件触发这个方法
      scroll(pos) {
        this.scrollY = pos.y
      },
      // 计算高度的私有方法。
      _calculateHeight() {
        this.listHeight = []
        // 拿到元素
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        // 拿到每一个子元素的高度
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 滚动到哪的方法，根据索引右侧滚动到第几个位置
      _scrollTo(index) {
        // 判断是不是有index
        if (!index && index !== 0) {
          return
        }
        // 当index小于0的时候
        if (index < 0) {
          // 赋值为0
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 如果右侧滚动我们左侧也要根据滚动，因为是向上走，所以要是-的
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    // 监控data的变化，data变化了，之后20毫秒，再去计算高度
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 监控scrollY的变化
      scrollY(newY) {
        // 保存这个listHeight
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0，将值赋为0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            // currentIndex DOM的映射
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      // 监视这个diff值，我们固定标题的滚动，会随着我们主要的部分进行部分滚动
      diff(newVal) {
        // 固定标题栏顶端的位置
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        // 给这个元素设置偏移
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
