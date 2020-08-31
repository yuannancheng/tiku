<template>
  <div class="random-body-wrap">
    <div class="random-body">
      <div class="create-random" @click="changeShowCreate">
        <span class="icon iconfont">&#xe604;</span>
        <span class="text">新建抽题</span>
      </div>
      <div class="history-random">
        <div class="history">历史抽题</div>
        <transition-group name="HistoryData">
          <div
            class="TestBox iconfont"
            v-for="(item, index) of HistoryData"
            :key="item.create"
            @click="handelHistoryClick(index)"
          >
            <div class="createTime" v-html="computeCreateTime(item.create)"></div>
            <div class="accuracy" v-html="computeAccuracy(item.data)"></div>
            <div class="duration" v-html="computeDuration(item.duration)"></div>
            <div class="schedule" v-html="computeSchedule(item.data)"></div>
            <span class="delete iconfont" @click.stop="handelDeleteRandomData(index)">&#xe600;</span>
          </div>
        </transition-group>
        <div v-show="HistoryData.length === 0" class="noData">还没有历史数据，快新建一个吧</div>
      </div>
    </div>
    <transition name="revoke">
      <div v-show="showRevoke" class="revoke">
        <div class="text">已删除一条历史数据</div>
        <div class="revoke-btn" @click="handelRevokeDeleteRandomData">撤销</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import _functions from '@functions/_functions'
export default {
  name: 'RandomBody',
  data () {
    return {
      timer: null,
      showRevoke: false
    }
  },
  computed: {
    ...mapState(['UserData']),
    HistoryData () {
      if ('Random' in this.UserData) return this.UserData.Random
      return []
    }
  },
  methods: {
    ...mapMutations(['createRandomData', 'deleteRandomData', 'revokeDeleteRandomData', 'removeDeleteCacher']),
    computeCreateTime (time) { // 创建时间
      return _functions.formatTime(time)
    },
    computeDuration (time) { // 用时
      return '&#xe692; ' + _functions.timeDifference(time)
    },
    computeSchedule (data) { // 进度
      let finish = 0
      if (Object.keys(data.record).length > 0) finish = Object.keys(data.record).length
      let maxLength = data.Test.length
      return '&#xe605; ' + finish + '/' + maxLength
    },
    computeAccuracy (data) { // 准确率
      if (Object.keys(data.record).length > 0) {
        const record = data.record
        let numFinish = 0
        let numFraction = 0
        let accuracy = 0
        for (let key in record) {
          const thisdata = record[key]
          if (thisdata.userSelect.length > 0) {
            numFinish += 1
            numFraction += thisdata.fraction
          }
        }
        accuracy = Math.floor((numFraction / numFinish) * 10000) / 10000
        accuracy = accuracy * 100 + '' // 避免js出现 0.1 + 0.2 != 0.3的情况
        if (accuracy.length > 5 && accuracy * 1 !== 100) {
          accuracy = accuracy.slice(0, 5)
        }
        accuracy = '&#xe6c1; ' + accuracy + '%'
        return accuracy
      }
      return '&#xe6c1; -'
    },
    changeShowCreate () {
      this.$emit('changeShowCreate', true)
    },
    handelDeleteRandomData (id) {
      this.deleteRandomData(id)
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.showRevoke = true
      this.timer = setTimeout(() => {
        this.showRevoke = false
        this.removeDeleteCacher()
        this.timer = null
      }, 3000)
    },
    handelRevokeDeleteRandomData () {
      clearTimeout(this.timer)
      this.timer = null
      this.revokeDeleteRandomData()
      this.showRevoke = false
    },
    handelHistoryClick (id) {
      this.$emit('changeTestDataIndex', id)
      this.$emit('changeShowExercise', true)
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'

  .revoke-enter,
  .revoke-leave-to
    transform: translateY(100%)
  .revoke-enter-to,
  .revoke-leave
    transform: translateY(0)
  .revoke-enter-active,
  .revoke-leave-active
    transition: .3s

  .HistoryData-move
    transition: .3s

  .random-body-wrap
    width: inherit
    .random-body
      padding: .5rem
      width: inherit
      background-color: #fff
      transition: .5s
      box-sizing: border-box
      user-select: none
      & *
        box-sizing: border-box
      .create-random
        width: 75%
        height: 1.65rem
        margin: 0 auto
        padding-top: .1rem
        text-align: center
        background-color: #C9E9FF
        cursor: pointer
        &:hover
          background-color: #D3EDFF
        .icon
          display: block
          font-size: 1rem
          border-radius: 50%
          color: #4390ee
        .text
          display: block
          margin-top: .05rem
          font-size: .34rem
          font-weight: 900
          color: #4390ee
      .history-random
        .history
          position: relative
          margin-top: .8rem
          padding-bottom: .1rem
          font-size: .35rem
          font-weight: 900
          color: #666
          border-bottom: #eee 1px solid
        .TestBox:nth-of-type(1)
          margin-top: .5rem
        .TestBox
          position: relative
          margin: .2rem auto
          padding: .2rem
          width: 95%
          min-height: 1.5rem
          background-color: #eee
          cursor: pointer
          &>*
            display: inline-block
            width: 2rem
            font-size: .34rem
            margin: .1rem
          .createTime
            display: block
            width: 100%
            height: auto
            margin: 0 0 .1rem
            font-size: .38rem
            font-weight: 700
          .delete
            position: absolute
            display: inline-block
            width: .5rem
            height: .5rem
            right: 0
            top: 0
            line-height: .5rem
            text-align: center
        .noData
          margin: .2rem auto
          padding: .2rem
          font-size: .3rem
    .revoke
      position: fixed
      display: block
      width: inherit
      height: .95rem
      bottom: 0
      background-color: #fff
      box-shadow: #ccc 0 0 7px
      .text
        position: absolute
        display: inline-block
        top: 50%
        left: .2rem
        transform: translateY(-50%)
        color: #333
        font-size: .34rem
      .revoke-btn
        position: absolute
        display: inline-block
        top: 50%
        right: .15rem
        transform: translateY(-50%)
        padding: .1rem
        color: $btnTxtColor
        box-sizing: border-box
        font-size: .34rem
        cursor: pointer
</style>
