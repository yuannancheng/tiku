<template>
  <div class="home-list">
    <div
      v-for="(item, index) of TestData"
      :key="index"
      class="home-list-TestInfo"
      @click="doTheTest(index)"
    >
      <span class="TestInfo-title">{{item.title}}</span>
      <span class="isDefault" v-if="'defaultData' in item" >默认题库</span>
      <transition name="deleteBtn">
        <span
          class="iconfont deleteBtn"
          v-show="showDeleteBtn"
          @click="deleteBtnClick(index)"
        >&#xe600;</span>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HomeList',
  computed: {
    // 将this.$store.state.TestData映射成this.TestData
    ...mapState(['TestData', 'UserNote', 'showDeleteBtn'])
  },
  methods: {
    ...mapMutations(['changeShowDeleteBtn', 'deleteTestData']),
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
      console.log('1234')
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

  .home-list
    padding: .5rem 0
    background-color: #fff
    user-select: none
    .home-list-TestInfo
      position: relative
      margin: .3rem auto
      padding: .2rem
      width: 80%
      height: 1rem
      border: #eee 1px solid
      background-color: #fff
      box-shadow: #eee 2px 2px 5px
      transition: .2s
      transform-origin: right
      cursor: pointer
      overflow: hidden
      .TestInfo-title
        position: absolute
        top: 50%
        left: .5rem
        transform: translateY(-50%)
        font-size: .35rem
      .isDefault
        position: absolute
        top: .2rem
        left: .2rem
        color: #666
        font-size: .15rem
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
    // .home-list-TestInfo:hover
    //   transform: scale(1.05)
</style>
