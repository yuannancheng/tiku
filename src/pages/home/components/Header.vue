<template>
  <div class="header">
    <div class="header-left" @click="handleFeedBackClick">反馈</div>
    <div class="header-title">理论题库</div>
    <div
      class="header-right iconfont"
      @click="handleMoreShow"
      v-clickoutside="handleMoreOutClick"
    >
      &#xe623;
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
            <li>{{editBtnContent}}</li>
            <li title="仅支持json格式文件">导入题库
              <input
                class="importFileBtn"
                type="file"
                @change="importFileAddressChange"
                multiple
                accept=".json"
              />
            </li>
            <li>下载工具</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import clickoutside from '@functions/clickoutside'
export default {
  name: 'HomeHeader',
  data () {
    return {
      moreListShow: false,
      editBtnContent: '编辑'
    }
  },
  methods: {
    handleFeedBackClick: function () {
      alert('发现问题了？\n快来告诉我吧！')
    },
    importFileAddressChange: function (e) {
      console.log(e.target.files)
    },
    handleMoreShow: function () {
      this.moreListShow = !this.moreListShow
    },
    handleMoreOutClick: function () {
      this.moreListShow = false
    }
  },
  directives: {
    clickoutside
  }
}
</script>

<!-- scoped 仅对当前组件产生影响 -->
<style lang="stylus" scoped>
  @import '~@styles/varibles.styl'
  @import '~@styles/moreList.styl'
  .header
    position: relative
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
    .header-left,
    .header-right
      position: absolute
      top: 50%
      transform: translateY(-50%)
    .header-title
      position: relative
      color: #333
      font-size: .4rem
      font-weight: 900
      cursor: auto
    .header-left
      left: .15rem
    .header-right
      font-size: .45rem
      right: 0
      padding: .3rem
      .header-more-list
        moreList()
        ul
          moreListChild()
          li
            moreListGrandChild()
            .importFileBtn
              position: absolute
              top: 0
              right: 0

</style>
