<template>
  <div class="header">
    <router-link
      tag="div"
      to="/"
      class="header-back iconfont"
    >&#xe602;</router-link>
    <div class="header-title" v-html="title">{{title}}</div>
    <div
      class="header-more"
      @click="handleMoreShow"
      v-clickoutside="handleMoreOutClick"
    >
      <span class="iconfont">&#xe623;</span>
      <transition
        name="more-list"
        enter-active-class="animate__animated animate__zoomIn"
        leave-active-class="animate__animated animate__zoomOut"
      >
        <div
          class="header-more-list"
          v-show="moreListShow"
          @click.stop
        >
          <ul>
            <li class="iconfont" @click="changeShowSeach">&#xe6ea; 搜索</li>
            <li class="iconfont">&#xe631; 统计</li>
            <li class="iconfont">&#xe601; 抽题</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import clickoutside from '@functions/clickoutside'
import { mapState } from 'vuex'
export default {
  name: 'ExerciseHeader',
  props: {
    TestDataIndex: {
      default: 0,
      validator (e) {
        return typeof (e * 1) === 'number'
      }
    }
  },
  data () {
    return {
      moreListShow: false
    }
  },
  computed: {
    ...mapState(['TestData']),
    title () {
      try {
        return this.TestData[this.TestDataIndex].title
      } catch (e) {
        return '加载中…'
      }
    }
  },
  methods: {
    handleMoreShow () {
      this.moreListShow = !this.moreListShow
    },
    handleMoreOutClick () {
      this.moreListShow = false
    },
    changeShowSeach () {
      this.$emit('changeShowSeach', true)
      this.moreListShow = false
    }
  },
  directives: {
    clickoutside
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/varibles.styl'
  @import '~@styles/moreList.styl'
  .header
    position: fixed
    z-index: 2
    top: 0
    width: inherit
    height: .95rem
    font-size: 0
    text-align: center
    color: $btnTxtColor
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    user-select: none
    *
      display: inline-block
      padding: .1rem
      font-size: .34rem
      cursor: pointer
    .header-title,
    .header-back,
    .header-more
      position: absolute
      top: 50%
      transform: translateY(-50%)
    .header-title
      position: relative
      max-width: 70%
      color: #333
      font-size: .38rem
      font-weight: 900
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: auto
    .header-back
      left: .15rem
      font-size: .45rem
    .header-more
      right: .15rem
      > span
        font-size: .45rem
      .header-more-list
        moreList()
        ul
          moreListChild()
          li
            moreListGrandChild()
</style>
