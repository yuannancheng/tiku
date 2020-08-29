<template>
  <div class="random-body">
    <div class="create-random">
      <span class="icon iconfont">&#xe604;</span>
      <span class="text">新建抽题</span>
    </div>
    <div class="history-random">
      <div class="history">历史抽题</div>
      <div class="TestBox iconfont" v-for="(item, index) of HistoryData" :key="item.create">
        <div class="createTime" v-html="computeCreateTime(item.create)"></div>
        <div class="accuracy" v-html="computeAccuracy(index)"></div>
        <div class="duration" v-html="computeDuration(item.duration)"></div>
        <div class="schedule" v-html="computeSchedule(index)"></div>
      </div>
      <div v-show="HistoryData.length === 0" class="noData">还没有历史数据，快新建一个吧</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _functions from '@functions/_functions'
export default {
  name: 'RandomBody',
  computed: {
    ...mapState(['UserData']),
    HistoryData () {
      if ('Random' in this.UserData) {
        return this.UserData.Random
      }
      return []
    }
  },
  methods: {
    computeCreateTime (time) { // 创建时间
      return _functions.formatTime(time)
    },
    computeDuration (time) { // 用时
      return '&#xe692; ' + _functions.timeDifference(time)
    },
    computeSchedule (id) { // 进度
      let finish = 0
      if (this.HistoryData[id].data.record.length) finish = this.HistoryData[id].data.record.length
      let maxLength = this.HistoryData[id].data.Test.length
      return '&#xe605; ' + finish + '/' + maxLength
    },
    computeAccuracy (id) { // 准确率
      if (this.HistoryData[id].data.record.length) {
        const record = this.HistoryData[id].data.record
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
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .random-body
    padding: .5rem
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
      background-color: #eee
      cursor: pointer
      &:hover
        background-color: #e1e1e1
      .icon
        display: block
        font-size: 1rem
        border-radius: 50%
        color: #999
      .text
        display: block
        margin-top: .05rem
        font-size: .34rem
        font-weight: 900
        color: #999
    .history-random
      .history
        position: relative
        margin-top: .8rem
        padding-bottom: .1rem
        font-size: .35rem
        font-weight: 900
        color: #666
        border-bottom: #eee 1px solid
      .TestBox:nth-of-type(2)
        margin-top: .5rem
      .TestBox
        position: relative
        margin: .2rem auto
        padding: .2rem
        width: 95%
        height: 1.5rem
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
      .noData
        margin: .2rem auto
        padding: .2rem
        font-size: .3rem
</style>
