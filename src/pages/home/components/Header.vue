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
  // 元素外点击事件
  // 代码来自 https://blog.csdn.net/qq_39785489/article/details/103299462
  directives: {
    clickoutside: { // 初始化指令
      bind (el, binding, vnode) {
        function documentHandler (e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      update () {},
      unbind (el, binding) { // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  }
}
</script>

<!-- scoped 仅对当前组件产生影响 -->
<style lang="stylus" scoped>
  @import '~styles/varibles.styl'
  @import '~styles/moreList.styl'
  .header
    position: relative
    height: 1rem
    font-size: 0
    text-align: center
    color: $btnTxtColor
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    user-select: none
    *
      display: inline-block
      padding: .1rem
      font-size: .35rem
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
