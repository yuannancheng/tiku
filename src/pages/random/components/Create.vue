<template>
  <div class="random-create">
    <div class="wrap">
      <div class="title">新建抽题</div>
      <div class="submit" @click="submitCreateRandom">确定</div>
      <div class="cancel" @click="closeCreate">取消</div>
      <div class="from">
        <div class="Test">
          <span class="name">题库：</span>
          <div :class="selectClassName()" v-clickoutside="clickOutSelect">
            <div class="tip" @click="changeShowSelectList">
              <span v-html="selectTip('text')"></span>
              <span class="icon iconfont" v-html="selectTip('icon')"></span>
            </div>
            <div
              v-for="(item, index) of TestData"
              :key="index"
              @click="chooseTest(index)"
              :class="optionsClassName(index)"
            >{{item.title}}</div>
          </div>
        </div>
        <div :class="computedRangeClass()">
          <span class="name">范围：</span>
          <input
            class="RangeLeft"
            v-model="rangeLeft"
            type="number"
            @focus="inputFocus"
            @blur="inputBlur();rewriteLfet()"
          />
          -
          <input
            class="RangeLeft"
            v-model="rangeRight"
            type="number"
            @focus="inputFocus"
            @blur="inputBlur();rewriteRight()"
          />
        </div>
        <div class="length">
          <div class="name">数量：</div>
          <input
            class="length-input"
            v-model="length"
            type="number"
            @focus="inputFocus"
            @blur="inputBlur"
            @input="rewriteLength"
          />
        </div>
        <div class="RegTip">
          选择多个题库时，将按各题库题目数量所占权重抽取，
          即：如果各题库题目数量相差悬殊且抽题总数过少，将不会从题量少的题库中抽取试题。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '@functions/clickoutside'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'RandomCreate',
  data () {
    return {
      selectTest: [],
      rangeLeft: '',
      rangeRight: '',
      length: '',
      showSelectList: false,
      creating: false
    }
  },
  watch: {
    selectTest () {
      let numLength = 0
      this.selectTest.forEach((e) => {
        numLength += this.TestData[e].data.length
      })
      if (this.selectTest.length > 1) {
        this.rangeLeft = ''
        this.rangeRight = ''
        this.length = numLength > 100 ? 100 : numLength
      } else if (this.selectTest.length === 1) {
        this.rangeLeft = 1
        this.rangeRight = numLength
        this.length = numLength > 100 ? 100 : Math.floor(numLength / 3)
      } else {
        this.rangeLeft = ''
        this.rangeRight = ''
        this.length = ''
      }
    }
  },
  computed: {
    ...mapState(['TestData'])
  },
  methods: {
    ...mapMutations(['createRandomData']),
    closeCreate () {
      this.$emit('changeShowCreate', false)
    },
    changeShowSelectList () {
      this.showSelectList = !this.showSelectList
    },
    clickOutSelect () {
      if (this.showSelectList) this.showSelectList = false
    },
    selectClassName () {
      var list = ['select']
      if (this.showSelectList) {
        list.push('more')
      }
      return list
    },
    selectTip (options) {
      switch (options) {
        case 'text':
          if (this.showSelectList && this.selectTest.length === 0) return '请选择'
          return '已选择' + this.selectTest.length + '项'
        case 'icon':
          if (this.showSelectList) return '&#xe6ee;'
          return '&#xe645;'
      }
    },
    chooseTest (id) {
      if (this.selectTest.includes(id)) {
        this.selectTest.splice(this.selectTest.indexOf(id), 1)
      } else {
        this.selectTest.push(id)
      }
    },
    optionsClassName (id) {
      var list = ['options']
      if (this.selectTest.includes(id)) {
        list.push('selected')
      }
      return list
    },
    computedRangeClass () {
      var list = ['range']
      if (this.selectTest.length > 1) list.push('noEdit')
      return list
    },
    inputFocus () {
      let el = event.target
      setTimeout(() => {
        el.type = 'text'
        el.select()
      }, 10)
    },
    inputBlur () {
      let el = event.target
      setTimeout(() => {
        el.type = 'number'
      }, 10)
    },
    rewriteLfet () {
      let rewrite = (this.rangeLeft + '').replace(/[^0-9]/g, '')
      if (this.selectTest.length > 0) {
        let maxLength = this.TestData[this.selectTest[0]].data.length
        // rewrite必须位于[1, max - 1] 且小于right
        if (rewrite.length === 0) rewrite = ''
        else if (this.rangeRight.length === 0) {
          if (rewrite * 1 > maxLength * 1 - 1) rewrite = maxLength * 1 - 1
          if (rewrite * 1 < 1) rewrite = 1
        } else {
          if (rewrite * 1 < 1) rewrite = 1
          if (rewrite * 1 > this.rangeRight * 1 - 1) rewrite = this.rangeRight * 1 - 1
        }
      }
      this.rangeLeft = rewrite
      this.rewriteLength()
    },
    rewriteRight () {
      let rewrite = (this.rangeRight + '').replace(/[^0-9]/g, '')
      if (this.selectTest.length > 0) {
        let maxLength = this.TestData[this.selectTest[0]].data.length
        // rewrite必须位于[2, max] 且大于left
        if (rewrite.length === 0) rewrite = ''
        else if (this.rangeLeft.length === 0) {
          if (rewrite * 1 > maxLength) rewrite = maxLength
          if (rewrite * 1 < 2) rewrite = 2
        } else {
          if (rewrite * 1 > maxLength) rewrite = maxLength
          if (rewrite * 1 < this.rangeLeft * 1 + 1) rewrite = this.rangeLeft * 1 + 1
        }
      }
      this.rangeRight = rewrite
      this.rewriteLength()
    },
    rewriteLength () {
      let rewrite = (this.length + '').replace(/[^0-9]/g, '')
      if (rewrite.length > 0) {
        let numLength = 0
        this.selectTest.forEach((e) => {
          numLength += this.TestData[e].data.length
        })
        if (this.selectTest.length === 1) {
          if (rewrite * 1 > this.rangeRight - this.rangeLeft + 1) rewrite = this.rangeRight - this.rangeLeft + 1
        }
        if (this.selectTest.length > 1) {
          if (rewrite * 1 > numLength) rewrite = numLength
        }
        if (rewrite * 1 < 1) rewrite = 1
      } else rewrite = ''
      this.length = rewrite
    },
    submitCreateRandom () {
      if (this.selectTest.length === 0) {
        alert('请至少选择一个题库')
        return
      }
      if (this.length.length === 0) {
        alert('数量至少为1')
        return
      }
      if (this.creating) return
      this.creating = true
      let countMax = 0
      const distribution = {}
      let CountDistribution = 0
      const result = []
      this.selectTest.forEach((e) => {
        countMax += this.TestData[e].data.length
      })
      this.selectTest.forEach((e) => {
        let thisLength = Math.floor(this.TestData[e].data.length / countMax * this.length)
        distribution[e] = thisLength
        CountDistribution += thisLength
      })
      if (CountDistribution < this.length) distribution[0] += 1
      for (const key in distribution) {
        const thisLength = distribution[key]
        let i = 0
        let thisMax = this.TestData[key].data.length
        const arr = []
        let thisResult = []
        if (this.rangeLeft !== '') i = this.rangeLeft - 1
        if (this.rangeRight !== '') thisMax = this.rangeRight
        for (; i < thisMax; i++) {
          arr.push(i)
        }
        for (let i = 0; i < thisLength; i++) {
          let ran = Math.floor(Math.random() * arr.length)
          thisResult.push(arr.splice(ran, 1)[0])
        }
        thisResult = thisResult.sort((a, b) => { return a - b })
        thisResult.forEach((e) => {
          result.push([key, e])
        })
      }
      this.createRandomData(result)
      this.selectTest = []
      this.rangeLeft = ''
      this.rangeRight = ''
      this.length = ''
      this.closeCreate()
      this.$emit('changeTestDataIndex', true)
      this.$emit('changeShowExercise', true)
      this.creating = false
    }
  },
  directives: {
    clickoutside
  }
}
</script>

<style lang="stylus" scpoed>
  .random-create
    position: fixed
    display: block
    width: inherit
    top: 0
    bottom: 0
    z-index: 2
    background-color: transparent
    user-select: none
    &::before
      content: ''
      position: absolute
      top: 0
      right: 0
      width: 100%
      height: 100%
      backdrop-filter: blur(5px) brightness(90%)
    .wrap
      position: relative
      width: 80%
      height: 6rem
      padding: .8rem .3rem 1.2rem
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      background-color: #fff
      box-sizing: border-box
      .title
        position: absolute
        top: 0
        left: .3rem
        right: .3rem
        padding: .2rem 0 .1rem
        font-size: .35rem
        font-weight: 900
        color: #333
        text-align: center
        border-bottom: #eee 1px solid
      .submit,
      .cancel
        position: absolute
        bottom: .3rem
        height: .6rem
        width: 1.3rem
        line-height: .6rem
        text-align: center
        font-size: .33rem
        box-shadow: #e6e6e6 0 0 7px
        cursor: pointer
        user-select: none
      .submit
        right: 1.9rem
        color: #fff
        background-color: #4390ee
      .cancel
        right: .3rem
        color: #333
        background-color: #fff
      .from
        position: relative
        display: block
        width: 100%
        height: 100%
        padding: .15rem
        color: #333
        font-size: .34rem
        // border: #eee 1px solid
        box-sizing: border-box
        .Test
          position: relative
          width: 100%
          height: 1rem
          font-size: 0
          z-index: 2
          .name
            position: relative
            display: inline-block
            float: left
            top: 0
            height: .64rem
            line-height: .54rem
            padding: .05rem .1rem
            font-size: .34rem
            white-space: nowrap
          .select
            position: relative
            display: block
            font-size: .34rem
            overflow: hidden
            height: .64rem
            padding: .05rem .1rem
            box-sizing: border-box
            border: #bbb 1px solid
            border-radius: .1rem
            background-color: #fff
            .tip
              height: .64rem
              line-height: .54rem
              padding: .05rem .1rem
              font-size: .3rem
              color: #666
              box-sizing: border-box
              cursor: pointer
              .icon
                position: absolute
                right: .2rem
                top: .03rem
                font-size: .22rem
                color: #666
            .options
              position: relative
              height: .64rem
              line-height: .54rem
              padding: .05rem .2rem
              box-sizing: border-box
              white-space: nowrap
              overflow-x: auto
              border-top: #eee 1px solid
              transition: .1s
              cursor: pointer
            .selected
              background-color: #D0E9F5
          .more
            height: auto
        .noEdit
          cursor: not-allowed
          pointer-events: none
          color: #999
          &::before
            content: ''
            position: absolute
            top: .3rem
            left: 0
            width: 90%
            height: 1px
            background-color: #999
            z-index: 1
        .range
          position: relative
          width: 100%
          height: 1rem
          font-size: .34rem
          .name
            position: relative
            display: inline-block
            float: left
            top: 0
            height: .64rem
            line-height: .54rem
            padding: .05rem .1rem
            font-size: .34rem
            white-space: nowrap
          input
            position: relative
            display: inline
            font-size: .34rem
            width: 30%
            height: .64rem
            padding: .05rem .1rem
            box-sizing: border-box
            border: #bbb 1px solid
            border-radius: .1rem
            background-color: #fff
            text-align: center
        .length
          position: relative
          width: 100%
          height: 1rem
          font-size: .34rem
          .name
            position: relative
            display: inline-block
            float: left
            top: 0
            height: .64rem
            line-height: .54rem
            padding: .05rem .1rem
            font-size: .34rem
            white-space: nowrap
          .length-input
            position: relative
            display: inline
            font-size: .34rem
            width: 30%
            height: .64rem
            padding: .05rem .1rem
            box-sizing: border-box
            border: #bbb 1px solid
            border-radius: .1rem
            background-color: #fff
            text-align: center
        .RegTip
          font-size: 12px
          color: #666
</style>
