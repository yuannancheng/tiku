<template>
  <div class="header">
    <div class="header-left" @click="handleFeedBackClick">反馈</div>
    <div class="header-title">理论题库</div>
    <div
      class="header-right"
      @click="handleMoreShow"
      v-clickoutside="handleMoreOutClick"
    >
      <span
        class="iconfont"
        v-html="moreBtnContent"
        :style="moreBtnContentStyle"
      >{{moreBtnContent}}</span>
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
            <li @click="editTestData">编辑</li>
            <li title="仅支持json格式文件">导入题库
              <input
                class="importFileBtn"
                type="file"
                @change="importFileAddressChange"
                multiple
                accept="application/json"
              />
            </li>
            <li @click="handelChangeShowBackUp">备份恢复</li>
            <li @click="handelGotoRepo">项目源码</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import clickoutside from '@functions/clickoutside'
// import _functions from '@functions/_functions'  // 打开QQ
import { mapMutations } from 'vuex'
export default {
  name: 'HomeHeader',
  props: {
    showDeleteBtn: Boolean
  },
  data () {
    return {
      moreListShow: false,
      moreBtnContentStyle: {
        fontSize: '.45rem'
      },
      localtions: {
        repo: 'https://gitee.com/yuannancheng/tiku',
        issues: 'https://gitee.com/yuannancheng/tiku/issues'
      }
    }
  },
  computed: {
    moreBtnContent () {
      if (this.showDeleteBtn) {
        return '完成'
      } else {
        return '&#xe623;'
      }
    }
  },
  methods: {
    ...mapMutations(['importTestData']),
    handleFeedBackClick () {
      // if (confirm('发现问题了？\n快来告诉我吧！')) {
      //   _functions.CallQQ(1470983522)
      // }
      window.open(this.$data.localtions.issues)
    },
    handelDownloadTool () {
      if (confirm('将要下载题库提取工具（约15MB），是否继续？')) {
        window.location.href = 'https://sinacloud.net/myfiles/tiku/858CF572.zip'
      }
    },
    handelGotoRepo () {
      window.open(this.$data.localtions.repo)
    },
    handelChangeShowBackUp () {
      this.$emit('changeShowBackUp', true)
      this.moreListShow = false
    },
    importFileAddressChange (e) {
      var _this = this
      var files = e.target.files
      for (var i = 0; i < files.length; i++) {
        var thisFile = files[i]
        if (thisFile.name.split('.').slice(-1)[0] === 'json') {
          let reader = new FileReader()
          reader.readAsText(thisFile)
          reader.onload = function () {
            var thisData = null
            try {
              thisData = JSON.parse(this.result)
            } catch (e) {}
            if (thisData && thisData['title'] && thisData['class'] && thisData['data'] && thisData['data'][0]['id'] === 0) {
              // 数据合格
              _this.importTestData(thisData)
            } else {
              console.log('\'' + thisFile.name + '\' 的数据结构不是预期的')
            }
          }
        } else {
          alert('\'' + thisFile.name + '\' 不是json格式的文件')
        }
      }
      this.moreListShow = false
    },
    handleMoreShow () {
      if (!this.showDeleteBtn) {
        this.moreListShow = !this.moreListShow
      } else {
        this.moreBtnContentStyle.fontSize = '.45rem'
        this.changeShowDeleteBtn(false)
      }
    },
    handleMoreOutClick () {
      if (this.moreListShow === true) {
        this.moreListShow = false
      }
    },
    editTestData () {
      this.moreBtnContentStyle.fontSize = '.34rem'
      this.moreListShow = false
      this.changeShowDeleteBtn(true)
    },
    changeShowDeleteBtn (value) {
      this.$emit('changeShowDeleteBtn', value)
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
    .header-left,
    .header-right
      position: absolute
      top: 50%
      transform: translateY(-50%)
    .header-title
      position: relative
      color: #333
      font-size: .38rem
      font-weight: 900
      cursor: auto
    .header-left
      left: .15rem
    .header-right
      right: .15rem
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
              opacity: 0
</style>
