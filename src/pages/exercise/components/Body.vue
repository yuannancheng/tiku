<template>
  <div class="body">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide
        v-for="TestId of showTestList"
        :key="TestId"
        class="TestContent"
      >
        <template v-if="thisTestData[TestId]"><!-- 避免数据还没加载出来时报错 -->
          <div class="type swiper-no-swiping">{{thisTestData[TestId].题型}}</div>
          <div class="title swiper-no-swiping">
            <div class="id">
              {{thisTestData[TestId].id + 1}}.
            </div>
            {{thisTestData[TestId].title}}
          </div>
          <template v-if="testType(TestId, '判断')">
            <div
              v-if="thisTestData[TestId].题型 === '判断'"
              class="options"
              v-for="content of ['对', '错']"
              :key="TestId + content"
              :optionData="content"
            >{{content}}</div>
          </template>
          <template v-else-if="testType(TestId, '单选')">
            <div
              class="options"
              v-for="(content, optionId) of thisTestData[TestId].选项"
              :key="TestId + String.fromCharCode((65 + optionId))"
              :optionData="String.fromCharCode((65 + optionId))"
            >{{content}}</div>
          </template>
          <template v-else-if="testType(TestId, '多选')">
            <div
              class="options"
              v-for="(content, optionId) of thisTestData[TestId].选项"
              :key="TestId + String.fromCharCode((65 + optionId))"
              :optionData="String.fromCharCode((65 + optionId))"
            >{{content}}</div>
            <div :class="{submit: true, canSubmit: canSubmit(TestId)}">确定</div>
            昨天写在这里，要把题库id重新赋值一遍，然后把确定按钮样式优化一下，
            再把按钮的逻辑绑定上，最后写一下计分函数。
          </template>
        </template>
        <div>
          题库id：{{TestDataIndex}}
          上次位置：{{lastIndex + 1}}
          题量：{{maxIndex + 1}}
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ExerciseBody',
  props: {
    DistributeData: {
      default: [0, 0, 100],
      validator (e) {
        return typeof (e[0] * 1) === 'number' && typeof (e[1] * 1) === 'number' && typeof (e[2] * 1) === 'number'
      }
    }
  },
  data () {
    return {
      swiperOptions: {
        observer: true,
        initialSlide: this.activeId,
        on: {
          slideChangeTransitionEnd () {
            this._this.setTestLastIndex([this._this.TestDataIndex, this._this.showTestList[this.activeIndex]])
          }
        }
      },
      lastTestDataIndex: 0,
      showTestList: [],
      activeId: 0,
      userSelect: {}
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData', 'UserNote']),
    thisTestData () {
      return this.TestData[this.lastTestDataIndex].data
    },
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    TestDataIndex () {
      return this.DistributeData[0]
    },
    lastIndex () {
      return this.DistributeData[1]
    },
    maxIndex () {
      return this.DistributeData[2]
    }
  },
  methods: {
    ...mapMutations(['setTestLastIndex']),
    computeShowList (id) {
      id = id || this.lastIndex
      var avtive = 2
      var list = []
      if (id < 1) {
        avtive = 0
        list[0] = 0
        list[1] = 1
        list[2] = 2
      } else if (id >= this.maxIndex) {
        list[0] = this.maxIndex - 2
        list[1] = this.maxIndex - 1
        list[2] = this.maxIndex
      } else {
        list[0] = id - 2
        list[1] = id - 1
        list[2] = id
        list[3] = id + 1
        list[4] = id + 2
      }
      this.avtiveId = avtive
      this.showTestList = list
      this.lastTestDataIndex = this.TestDataIndex
      this.$nextTick(() => {
        this.swiper.slideTo(avtive, 0, false)
      })
    },
    testType (id, type) {
      return this.thisTestData[id].题型 === type
    },
    canSubmit (id) {
      return id in this.userSelect && this.userSelect[id].length > 0
    }
  },
  watch: {
    lastIndex () {
      this.computeShowList()
    }
  },
  mounted () {
    // swiper on方法中this作用域发生变化，故拷贝一份过去
    this.swiper._this = this
    this.computeShowList()
  },
  activated () {
    // 当重新选择题库回到页面时，重新渲染，把多选题预选清空
    if (this.lastTestDataIndex !== this.TestDataIndex) {
      this.computeShowList()
      this.userSelect = {}
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .body
    .TestContent
      position: relative
      min-height: 87vh
      padding: .3rem
      box-sizing: border-box
      > *
        position: relative
        font-size: .36rem
      .type
        position: absolute
        top: .2rem
        left: .2rem
        height: .42rem
        line-height: .44rem
        padding: 0 .13rem
        font-size: .26rem
        color: #fff
        background-color: #25C27D
        box-sizing: border-box
        border-radius: 0 .23rem 0 .23rem
        user-select: none
      .title
        display: inline-block
        margin-bottom: .3rem
        line-height: .55rem
        word-break: break-all
        letter-spacing: .01rem
        .id
          display: inline
          margin-left: .9rem
          user-select: none
      .options
        margin: .5rem auto
        padding: .3rem .2rem .3rem .66rem
        width: 80%
        word-break: break-all
        text-indent: -.36rem
        box-shadow: #e1e1e1 0 0 10px
        box-sizing: border-box
        cursor: pointer
      .submit
        display: block
        position: relative
        margin: 1rem auto .2rem
        width: 2rem
        height: .5rem
        line-height: .5rem
        padding: .2rem .4rem
        color: #fff
        background-color: #4390ee
        font-size: .4rem
        text-align: center
        border-radius: .5rem
        cursor: pointer
        user-select: none
</style>
