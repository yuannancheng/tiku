<template>
  <div class="exercise-count" v-clickoutside="closeCount">
    <div class="header">
      <div class="redo" @click="redoTest">重做</div>
      <div class="title">
        统计
        <div class="testTitle">{{TestTitle}}</div>
      </div>
      <div class="close iconfont" @click="closeCount">&#xe68b;</div>
    </div>
    <div class="info">
      <div class="accuracy">
        <span class="mes">正确率</span>：
        <span class="data">{{Answers.accuracy}}</span>
      </div>
      <div class="population">
        <span class="mes">总共</span>：
        <span class="data">{{population}} 题</span>
      </div>
      <div class="finish">
        <span class="mes">完成</span>：
        <span class="data">{{Answers.finish}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '@functions/clickoutside'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ExerciseCount',
  props: {
    TestDataIndex: Number,
    maxIndex: Number,
    TestTitle: String
  },
  computed: {
    ...mapState(['UserData']),
    population () {
      return this.maxIndex + 1
    },
    Answers () {
      if (this.TestDataIndex in this.UserData) {
        var Answers = {
          'accuracy': '',
          'finish': 0
        }
        var numFinish = 0
        var numFraction = 0
        for (var key in this.UserData[this.TestDataIndex].data) {
          var thisdata = this.UserData[this.TestDataIndex].data[key]
          if (thisdata.userSelect.length > 0) {
            numFinish += 1
            numFraction += thisdata.fraction
          }
        }
        var accuracy = Math.floor((numFraction / numFinish) * 10000) / 10000
        accuracy = accuracy * 100 + '' // 避免js出现 0.1 + 0.2 != 0.3的情况
        if (accuracy.length > 5 && accuracy * 1 !== 100) {
          accuracy = accuracy.slice(0, 5)
        }
        accuracy += '%'
        Answers.accuracy = accuracy
        Answers.finish = numFinish + ' 题'
        if (numFinish === 0) {
          Answers.accuracy = ' -'
          Answers.finish = ' -'
        }
        return Answers
      }
    }
  },
  methods: {
    ...mapMutations(['redoOfTheTest']),
    closeCount () {
      this.$emit('changeShowCount', false)
    },
    redoTest () {
      console.log('click')
      if (confirm('是否重做当前题库？\n这不会删除你的笔记')) {
        this.redoOfTheTest(this.TestDataIndex)
        this.$emit('jumpTest', 1)
        this.closeCount()
      }
    }
  },
  directives: {
    clickoutside
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .exercise-count
    position: fixed
    top: 0
    z-index: 3
    width: inherit
    height: 5rem
    .header
      position: absolute
      width: 100%
      height: .95rem
      padding: 0 1.2rem
      font-size: 0
      text-align: center
      color: $btnTxtColor
      background-color: #fff
      user-select: none
      box-sizing: border-box
      .redo
        position: absolute
        top: 50%
        transform: translateY(-50%)
        left: .15rem
        padding: .1rem
        font-size: .34rem
        color: $btnTxtColor
        cursor: pointer
      .title
        position: relative
        display: block
        height: .95rem
        font-size: .38rem
        line-height: .8rem
        font-weight: 900
        color: #333
        .testTitle
          position: absolute
          top: .6rem
          left: 0
          width: 100%
          font-size: .25rem
          color: #aaa
          line-height: normal
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
      .close
        position: absolute
        display: inline-block
        top: 50%
        transform: translateY(-50%)
        right: .15rem
        padding: .1rem
        font-size: .4rem
        color: $btnTxtColor
        box-sizing: border-box
        cursor: pointer
    .info
      position: absolute
      top: .95rem
      width: 100%
      height: 4rem
      padding: .5rem
      background-color: #fff
      border-bottom: #eee 1px solid
      box-sizing: border-box
      user-select: none
      &::before
        content: ''
        position: absolute
        top: .1rem
        left: 50%
        transform: translateX(-50%)
        width: 70%
        height: 1px
        background-color: #eee
      > div
        display: block
        height: .95rem
        line-height: .95rem
        margin: .1rem 0
        padding: 0 .3rem
        box-sizing: border-box
        background-color: #eee
        > span
          font-size: .34rem
        .mes
          display: inline-block
          text-align-last: justify
          text-align: justify
          text-justify: distribute-all-lines
          width: 1.5rem
          color: #666
        .data
          color: #666
</style>
