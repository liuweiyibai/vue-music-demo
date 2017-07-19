<!--轮播图组件-->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
          <!--插槽组件,在调用当前组件的时候会向组件中出入HTML标签。然后我们在当前组件中可以操作这些HTML标签-->
      </slot>
    </div>
    <div class="dots">
      <!--：class是通过数据切换class-->
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    // 可以外部控制这个组件，recommend组件中传值
    props: {
        /* 循环轮播 */
      loop: {
        type: Boolean,
        default: true
      },
      /* 自动轮播 */
      autoPlay: {
        type: Boolean,
        default: true
      },
      /* 自动轮播的间隔 */
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        // 表示当前是第几页
        currentPageIndex: 0
      }
    },
    /* 钩子函数，当我们的dom渲染已经完成之后执行,但是我们的slot插入的数据是v-for来的，v-for的数据是请求回来的，而请求的过程是异步的过程，但是我们mounted是同步执行的，所以要在recommend组件中判断是否有请求的数据返回 */
    mounted() {
      // 为什么要用定时器：保证btscroll渲染是正常渲染的，保证dom会渲染完成，20毫秒后，之后进行一些初始化操作
      setTimeout(() => {
        this._setSliderWidth()
        // 因为会轮播图会多生成两个标签来保证无缝滚动，所哟我们必须手动设置子元素 的个数为5个。
        this._initDots()
        this._initSlider()
        // 如果autoPlay我们就执行_play方法
        if (this.autoPlay) {
          this._play()
        }
      }, 20);
      // 因为如果改变屏幕大小，轮播图的显示会发生改变。所以我们会监听resize事件。
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    activated() {
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
        /* 1.设置横向滚动的宽度方法，计算并且设置宽度 */
      _setSliderWidth(isResize) {
        // 获取整个列表有多少个元素
        this.children = this.$refs.sliderGroup.children
        // 设置一个
        let width = 0
        // 获得父容器的宽度，就是当前屏幕的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        // 通过循环设置每一个子元素的宽度为当前屏幕宽度，
        for (let i = 0; i < this.children.length; i++) {
          // 获取到每一个子元素
          let child = this.children[i]
          // 在父元素中不能为他添加样式，所以我们要在循环 的时候给每一个子元素添加样式。
          addClass(child, 'slider-item')
          // 给每一个子元素设置宽度为父元素的宽度
          child.style.width = sliderWidth + 'px';
          // 然后将宽度累加起来，方便操作、
          width += sliderWidth;
        }
        // 因为是无缝滚动，所以会自动生成两个标签，所以总得宽度还要加上两个子元素的宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        // 然后设置宽度为我们计算得来的总宽度。
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      /* 初始化轮播图 */
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          //
          scrollY: false,
          // 惯性
          momentum: false,

          snap: true,
          // 循环
          snapLoop: this.loop,

          snapThreshold: 0.3,
          //
          snapSpeed: 400
        })
        // 初始化sliter的时候可以帮点一个事件，scrollEnd，滚动完毕的时候，回调函数中可以获得当前页。
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          // 如果我当前的是循环的，pageIndex会减一，因为loop模式下是会向第一个前面新加一个元素的，所以要-1
          if (this.loop) {
            pageIndex -= 1
          }
          // 将其赋值
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      // 初始化dots，就是新建一个数组长度为5
      _initDots() {
        this.dots = new Array(this.children.length)
      },

      _play() {
        // 获得currentPageIndex+1
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          // 这个滚动插件子代的方法，this.interva是轮播的间隔
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
