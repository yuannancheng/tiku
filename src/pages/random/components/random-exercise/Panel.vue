<template>
  <div class="ExercisePanel">
    <div class="header">
      <div class="title">答题卡</div>
      <div class="goto">
        <input
          ref="indexInput"
          class="number"
          type="number"
          placeholder="题号"
          v-model="gotoIndex"
          @input="rewriteGotoIndex"
          @focus="inputFocus"
          @blur="inputBlur"
          @keydown.enter="jumpTest"
        />
        <div class="submit iconfont" @click="jumpTest">&#xe6cd;</div>
      </div>
      <div class="close iconfont" @click="closePanel">&#xe68b;</div>
    </div>
    <div class="content" ref="wrapper">
      <div>
        <template v-if="hasData" v-for="(arr, title) of TestList">
          <div class="TestTitle" :key="title">{{title}}</div>
          <div class="idBox" :key="title + 'Box'">
            <span
              v-for="TestArr of arr"
              :key="TestArr[1]"
              :ref="TestArr[1]"
              :class="indexClassName(TestArr)"
              @click="jumpTest(TestArr[1] * 1 + 1)"
            >{{(TestArr[0][1] * 1 + 1)}}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bscroll from 'better-scroll'
import _functions from '@functions/_functions'
export default {
  name: 'RandomExercisePanel',
  props: {
    TestDataIndex: Number
  },
  data () {
    return {
      gotoIndex: '',
      TestList: {}
    }
  },
  watch: {
    TestDataIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) this.computeTestList()
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData', 'UserNote']),
    lastIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return this.UserData.Random[this.TestDataIndex].lastIndex * 1
    },
    maxIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return this.UserData.Random[this.TestDataIndex].data.Test.length
    },
    hasData () {
      return (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      )
    }
  },
  methods: {
    closePanel () {
      this.$emit('changeShowPanel', false)
    },
    rewriteGotoIndex () {
      var rewrite = this.gotoIndex.replace(/[^0-9]/g, '')
      // 使rewrite = int([1:maxIndex])|''
      rewrite = rewrite.length === 0 ? '' : rewrite * 1 > this.maxIndex + 1 ? this.maxIndex + 1 : rewrite * 1 > 0 ? rewrite : ''
      this.gotoIndex = rewrite
    },
    // 动态修改type，为了唤起数字键盘且用户输入非数字字符不被浏览器转成空值
    inputFocus () {
      setTimeout(() => {
        this.$refs.indexInput.type = 'text'
      }, 10)
    },
    inputBlur () {
      setTimeout(() => {
        this.$refs.indexInput.type = 'number'
      }, 10)
    },
    jumpTest (id) {
      id = typeof id === 'number' ? id : this.gotoIndex
      // 避免rewrite后内容为数字类型，无法判断length
      let strId = this.gotoIndex + ''
      if (strId.length > 0 || id) {
        this.$emit('jumpTest', id)
        this.gotoIndex = ''
        this.$refs.indexInput.blur()
      }
    },
    indexClassName (arr) {
      const id = arr[0][1]
      const index = arr[1]
      const list = ['index']
      if (this.lastIndex === index) list.push(['activeIndex', 'iconfont'])
      if (index in this.UserData.Random[this.TestDataIndex].data.record) {
        const fraction = this.UserData.Random[this.TestDataIndex].data.record[index].fraction
        switch (fraction) {
          case 1:
            list.push('select-yes')
            break
          case 0:
            list.push('select-no')
            break
          default:
            list.push('select-half')
        }
      }
      if (arr[0][0] in this.UserNote && id in this.UserNote[arr[0][0]] && this.UserNote[arr[0][0]][id] !== '') {
        list.push(['has-note', 'iconfont'])
      }
      return list
    },
    _activated () {
      if (_functions.IsPC()) {
        this.$refs.indexInput.focus()
      }
      window.addEventListener('keydown', this.handelKeydown)
      this.$nextTick(() => {
        this.scroll.refresh()
        const el = this.$refs[this.lastIndex][0]
        this.scroll.scrollToElement(el, 0, 0, -260)
      })
    },
    _deactivated () {
      window.removeEventListener('keydown', this.handelKeydown)
    },
    handelKeydown (e) {
      const keyCode = e.keyCode
      switch (keyCode) {
        case 27: // Esc键
          this.closePanel()
          break
      }
    },
    computeTestList () {
      const list = {}
      const TestData = this.UserData.Random[this.TestDataIndex].data.Test
      TestData.forEach((e, i) => {
        const thisTitle = this.TestData[e[0]].title
        if (!(thisTitle in list)) list[thisTitle] = []
        list[thisTitle].push([e, i])
      })
      this.TestList = list
    }
  },
  mounted () {
    if (
      'Random' in this.UserData &&
      this.TestDataIndex in this.UserData.Random
    ) {
      this.computeTestList()
      this.scroll = new Bscroll(this.$refs.wrapper, {
        click: true,
        mouseWheel: true
      })
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  @keyframes focus{
    0%{
      transform: scale(1) translate(-50%, -50%)
    }
    100%{
      transform: scale(1.15) translate(-50%, -50%)
    }
  }
  .ExercisePanel
    position: fixed
    top: 0
    bottom: 0
    width: inherit
    background-color: #fff
    z-index: 4
    .header
      position: fixed
      z-index: 4
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
      .title,
      .goto,
      .close
        position: absolute
        top: 50%
        transform: translateY(-50%)
      .title
        left: .2rem
        color: #333
        font-size: .38rem
        font-weight: 900
        cursor: auto
      .goto
        position: relative
        width: 1.9rem
        .number,
        .submit
          position: absolute
          top: 50%
          transform: translateY(-50%)
        .number
          left: 0
          padding: .1rem
          width: 1.35rem
          height: .6rem
          font-size: .3rem
          text-align: center
          border: #eee 1px solid
          box-sizing: border-box
          cursor: text
        .submit
          right: 0
          font-size: .45rem
      .close
        right: .2rem
        font-size: .4rem
    .content
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-color: #fff
      overflow: hidden
      user-select: none
      > div
        padding: .95rem .2rem 0
        cursor: default
        .TestTitle
          margin: .2rem 0 .1rem
          height: .95rem
          line-height: .95rem
          font-size: .37rem
          font-weight: 900
          color: #333
          background-color: #eee
          text-align: center
        .idBox
          display: flex
          display: -webkit-flex /*Safari*/
          justify-content: space-between
          align-items: center
          flex-wrap: wrap
          .index
            position: relative
            display: inline-block
            width: .8rem
            height: .8rem
            line-height: .8rem
            margin: .43rem
            padding: .1rem
            font-size: .34rem
            text-align: center
            box-shadow: #e6e6e6 0 0 7px
            cursor: pointer
            &:last-child
              margin-right: auto
          .select-yes /* 选对了的 */
            color: #fff
            background-color: #25C27D
          .select-no /* 选错了的 */
            color: #fff
            background-color: #FF7A7A
          .select-half /* 多选题不全对 */
            color: #fff
            background-color: #FDDC9A
          .activeIndex
            &::after
              content: '\e603'
              position: absolute
              left: 50%
              top: 50%
              height: 1.5rem
              width: 1.5rem
              line-height: 1.5rem
              color: #4390EE
              font-size: 1.5rem
              pointer-events: none
              transform: translate(-50%, -50%)
              animation: focus .5s linear infinite alternate
              transform-origin: 0% 0%
          .has-note
            &::before
              content: '\e63e'
              display: block
              position: absolute
              top: 0
              right: 0
              width: 15px
              height: 15px
              line-height: 100%
              font-size: 15px
              text-align: center
              pointer-events: none
              color: #FFFFFF
</style>
