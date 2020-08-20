<template>
  <div class="home-list">
    <transition-group name="TestInfo" appear>
      <div
        v-for="(item, index) of TestData"
        :key="item.title"
        class="home-list-TestInfo"
        :style="TestInfoStyle(index)"
        @click="doTheTest(index)"
      >
        <span class="TestInfo-title">{{item.title}}</span>
        <span class="isDefault" v-if="'defaultData' in item" >默认题库</span>
        <span class="TestLength">{{TestLength(index)}}</span>
        <transition name="deleteBtn">
          <span
            class="iconfont deleteBtn"
            v-show="showDeleteBtn"
            :style="deleteBtnStyle(index)"
            @click="deleteBtnClick(index)"
          >&#xe600;</span>
        </transition>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HomeList',
  data () {
    return {
      isHomeLeave: false,
      isHomeEnter: false
    }
  },
  computed: {
    // 将this.$store.state.TestData映射成this.TestData
    ...mapState(['TestData', 'UserNote', 'showDeleteBtn'])
  },
  methods: {
    ...mapMutations(['changeShowDeleteBtn', 'deleteTestData']),
    TestInfoStyle (index) {
      return 'transition-delay: ' + 0.1 * index + 's;'
    },
    deleteBtnStyle (index) {
      return 'transition-delay: ' + 0.07 * index + 's;'
    },
    TestLength (index) {
      var TestLength = this.TestData[index].data.length
      TestLength = TestLength > 0 ? TestLength + '题' : ''
      return TestLength
    },
    deleteBtnClick (id) {
      if (event) event.stopPropagation()
      if (confirm('删除非默认题库后无法恢复，\n是否继续？')) {
        var hasNote = []
        if (id in this.UserNote) {
          for (var key in this.UserNote[id]) {
            hasNote.push(--key + 1)
          }
        }
        if (hasNote.length !== 0) {
          alert('不能删除做有笔记的题库！请先删除笔记。\n以下题目做有笔记：\n    ' + hasNote.join('、'))
        } else {
          this.deleteTestData(id)
        }
      }
    },
    doTheTest (id) {
      this.$router.push('exercise/' + id)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .deleteBtn-enter,
  .deleteBtn-leave-to
    transform: translateX(100%)
  .deleteBtn-enter-to,
  .deleteBtn-leave
    transform: translateX(0)
  .TestInfo-enter,
  .TestInfo-leave-to
    transform: translateX(-120%)
    opcity: 0
  .TestInfo-enter-to,
  .TestInfo-leave
    transform: translateX(0)
    opcity: 1

  .home-list
    padding: .5rem 0
    background-color: #fff
    transition: .5s
    user-select: none
    .home-list-TestInfo
      position: relative
      margin: .3rem auto
      padding: .2rem
      width: 80%
      height: 1rem
      border: #eee 1px solid
      background-color: #FFFFFF
      box-shadow: #eee 2px 2px 5px
      transition: 1s
      cursor: pointer
      overflow: hidden
      .TestInfo-title
        position: absolute
        top: 60%
        left: .4rem
        transform: translateY(-50%)
        max-width: 80%
        padding: .05rem 0
        font-size: .36rem
        font-weight: 700
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
      .isDefault,
      .TestLength
        position: relative
        margin-top: .2rem
        margin-left: .2rem
        color: #999
        font-size: .2rem
        font-style: italic
      .deleteBtn
        position: absolute
        top: 0
        right: 0
        width: 1.4rem
        height: 1.4rem
        line-height: 1.4rem
        text-align: center
        font-size: .5rem
        color: #fff
        background-color: #F7603E
        transition: .5s
</style>
