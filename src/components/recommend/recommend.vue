<!--推荐组件，这里使用了轮播图组件-->
<template>
  <div class="recommend" ref="recommend">
    <!-- 因为scroll会很常用到，所以抽象为一个组件 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!--因为会遇到dom渲染完成后数据还没返回的问题，所以我们先判断recommends数据是不是已经返回了-->
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <!-- 轮播图组件 -->
          <slider>
            <!--下面的标签就是插入到slider组件插槽中的标签-->
            <!--遍历这个recommends，，a标签bind上一个href属性动态地址-->
            <!--@load="loadImage" 图片-->
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <!-- 在这里监听img的onload事件 -->
                <!-- class="needsclick" fastclick不会拦截带有这个类名的元素的点击 -->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单，使用flex布局 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <!-- v-lazy代替:src 就可以就进行懒加载 -->
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 使用laoding组件，需要一个外部容器控制它的位置。显示条件是discList没有返回数据 -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  /* 轮播图组件 */
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {playlistMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    /* 在组件生命周期被创建的时候获取数据，调用自己的方法 */
    created() {
      // 获取数据函数
      this._getRecommend();
      // 调用获取歌单列表
      this._getDiscList();
    },
    /* 自己的方法在API目录下的文件中配置着，使用的时候引入。 */
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      // 只要有一张图片加载完成就会触发这个方法
      loadImage() {
        // 因为有多个图片，每个图片加载完成都会执行，那样太浪费资源，所以我们定义一个标志位，来控制它只执行一次。
        if (!this.checkloaded) {
          this.checkloaded = true
          // 调用scroll组件中的refresh()
          this.$refs.scroll.refresh()
        }
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      /* 获得数据根据promise函数来写的，获取推荐列表，利用了jsonp函数获取数据 */
      _getRecommend() {
        // 因为是一个promise函数，所以then回调后会返回值。
        getRecommend().then((res) => {
          // 判断我们ERR_OK是不是和返回的res.code相等
          if (res.code === ERR_OK) {
            // 然后将recommend值赋值为返回的数据，然后传递到歌单组件
            this.recommends = res.data.slider
          }
        })
      },
      // 获取歌单列表
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
