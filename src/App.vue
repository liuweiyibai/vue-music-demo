<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!--keep-alive组件，使路由视图切换的时候保持原样-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<!--主视图，-->
<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Player from 'components/player/player'
  import Tab from 'components/tab/tab'

  export default {
      /* 注册的组件，其他的组件都是在router配置文件中引入的。 */
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
