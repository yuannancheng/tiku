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
              {{TestId + 1}}.
            </div>
            {{thisTestData[TestId].title}}
          </div>
          <template v-if="testType(TestId, '判断')">
            <div
              v-if="thisTestData[TestId].题型 === '判断'"
              v-for="content of ['对', '错']"
              :key="content"
              :class="optionClassName(TestId, '判断', content)"
              @click="handelOptionSelect(TestId, '判断', content)"
            >{{content}}</div>
          </template>
          <template v-else-if="testType(TestId, '单选')">
            <div
              v-for="(content, optionId) of thisTestData[TestId].选项"
              :key="String.fromCharCode(65 + optionId)"
              :class="optionClassName(TestId, '单选', String.fromCharCode(65 + optionId))"
              @click="handelOptionSelect(TestId, '单选', String.fromCharCode(65 + optionId))"
            >{{content}}</div>
          </template>
          <template v-else-if="testType(TestId, '多选')">
            <div
              v-for="(content, optionId) of thisTestData[TestId].选项"
              :key="String.fromCharCode(65 + optionId)"
              :class="optionClassName(TestId, '多选', String.fromCharCode(65 + optionId))"
              @click="handelOptionSelect(TestId, '多选', String.fromCharCode(65 + optionId))"
            >{{content}}</div>
            <div
              v-if="showSubmitBtn(TestId)"
              :class="submitClassName(TestId)"
              @click="handelMultipleChoice(TestId)"
            >确定</div>
          </template>
          <div
            v-if="showAnswer(TestId)"
            class="answerAndFraction"
          >
            <span class="answer">正确答案：{{getAnswerAndFraction(TestId)[0].join('、')}}</span>
            <span class="fraction">得分：{{getAnswerAndFraction(TestId)[1]}}</span>
          </div>
        </template>
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
    },
    listenKeydown: Boolean
  },
  data () {
    return {
      // swiper配置项
      swiperOptions: {
        observer: true,
        initialSlide: this.activeId,
        on: {
          slideChangeTransitionEnd () {
            this._this.setTestLastIndex([this._this.TestDataIndex, this._this.showTestList[this.activeIndex]])
          }
        }
      },
      lastTestDataIndex: 0, // 上一次进入页面的题库id，用于检测是否切换了题库
      showTestList: [], // 当前动态加载的题目
      activeId: 0, // 展示给用户的题目在showTestList中的下标
      userSelect: {}, // 用户预选的选项，在用户点击确定按钮后清除当前题目的预选
      shakeOptions: {}, // 需要警告的选项，用户选错/应选却没选的
      Timer: null // 键盘事件函数节流
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
    ...mapMutations(['setTestLastIndex', 'setOptionSelect']),
    // 计算需要动态加载的题目
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
    // 用于v-if计算加载哪种答题框架
    testType (id, type) {
      return this.thisTestData[id].题型 === type
    },
    // 计算选项需要绑定哪些样式
    optionClassName (id, type, options) {
      var className = ['options']
      var thisUserData = this.UserData[this.TestDataIndex].data
      switch (type) {
        case '判断':
        case '单选':
          if (
            id in thisUserData &&
            thisUserData[id].userSelect.length > 0
          ) {
            if (this.thisTestData[id].正确答案.includes(options)) {
              className.push('select-yes')
            } else if (thisUserData[id].userSelect.includes(options)) {
              className.push('select-no')
              if (id in this.shakeOptions && this.shakeOptions[id].includes(options)) {
                className.push('animate__animated', 'animate__headShake') // animate__shakeX 摇晃得更厉害
              }
            }
          }
          break
        case '多选':
          if (
            id in thisUserData &&
            thisUserData[id].userSelect.length > 0
          ) {
            if (this.thisTestData[id].正确答案.includes(options)) {
              if (thisUserData[id].userSelect.includes(options)) {
                className.push('select-yes')
              } else {
                className.push('noselect-answer')
                if (id in this.shakeOptions && this.shakeOptions[id].includes(options)) {
                  className.push('animate__animated', 'animate__headShake')
                }
              }
            } else if (thisUserData[id].userSelect.includes(options)) {
              className.push('select-no')
              if (id in this.shakeOptions && this.shakeOptions[id].includes(options)) {
                className.push('animate__animated', 'animate__headShake')
              }
            }
          } else if (id in this.userSelect && this.userSelect[id].length > 0) {
            if (this.userSelect[id].includes(options)) {
              // 绑定预选样式
              className.push('select-assum')
            }
          }
          break
      }
      return className
    },
    // 计算多选题确定按钮的样式
    submitClassName (id) {
      var className = ['submit']
      if (id in this.userSelect && this.userSelect[id].length >= 2) {
        className.push('canSubmit')
      }
      return className
    },
    // 计算是否展示确定按钮
    showSubmitBtn (id) {
      return !(
        id in this.UserData[this.TestDataIndex].data &&
        this.UserData[this.TestDataIndex].data[id].userSelect.length >= 2
      )
    },
    // 处理计算分数/绑定预选
    handelOptionSelect (id, type, options) {
      // var el = event.toElement
      var thisUserData = this.UserData[this.TestDataIndex].data
      switch (type) {
        case '判断':
        case '单选':
          if (
            id in thisUserData &&
            thisUserData[id].userSelect.length > 0
          ) return false // 已经选择过答案，不能触发
          else {
            var fraction = 0
            if (this.thisTestData[id].正确答案.includes(options)) {
              fraction = 1
            } else {
              this.$set(this.shakeOptions, [id], options)
              setTimeout(() => {
                this.$delete(this.shakeOptions, [id])
              }, 2000)
            }
            if (fraction === 1) {
              setTimeout(() => {
                this.swiper.slideNext()
              }, 500)
            }
            this.setOptionSelect([this.TestDataIndex, this.lastIndex, options, fraction])
          }
          break
        case '多选':
          if (id in this.userSelect) {
            if (this.userSelect[id].includes(options)) {
              this.userSelect[id].splice(this.userSelect[id].indexOf(options), 1)
              if (this.userSelect[id].length === 0) {
                this.$delete(this.userSelect, [id])
              }
            } else {
              this.userSelect[id].push(options)
            }
          } else {
            this.$set(this.userSelect, [id], [options])
          }
          break
      }
    },
    handelMultipleChoice (id) {
      if (
        id in this.userSelect &&
        this.userSelect[id].length >= 2
      ) {
        var answer = this.thisTestData[id].正确答案
        var select = this.userSelect[id]
        var selectNo = false
        var selectYes = []
        var shakeOptions = []
        var el = event.toElement
        select.forEach((e) => {
          if (answer.includes(e)) selectYes.push(e)
          else selectNo = true
        })
        var fraction = selectNo ? 0 : Math.round((selectYes.length / answer.length) * 100) / 100
        // 答错左右抖动
        var elements = el.parentElement.getElementsByClassName('options')
        for (var i = 0; i < elements.length; i++) {
          var td = String.fromCharCode(65 + i)
          if (
            (!selectYes.includes(td) && !answer.includes(td)) ||
            (!select.includes(td) && answer.includes(td))
          ) {
            shakeOptions.push(td)
          }
        }
        this.$set(this.shakeOptions, [id], shakeOptions)
        setTimeout(() => {
          this.$delete(this.shakeOptions, [id])
        }, 2000)
        // 答对切换下一题
        if (fraction === 1) {
          setTimeout(() => {
            this.swiper.slideNext()
          }, 500)
        }
        this.setOptionSelect([this.TestDataIndex, id, select, fraction])
      }
    },
    showAnswer (id) {
      return (
        id in this.UserData[this.TestDataIndex].data &&
        this.UserData[this.TestDataIndex].data[id].userSelect.length > 0
      )
    },
    getAnswerAndFraction (id) {
      if (this.showAnswer(id)) {
        return [this.thisTestData[id].正确答案, this.UserData[this.TestDataIndex].data[id].fraction]
      }
    },
    handelKeydown (e) {
      var keyCode = e.keyCode
      switch (keyCode) {
        case 32:
          this.$emit('changeShowPanel', true)
          break
        case 37:
          if (!this.Timer) {
            this.Timer = setTimeout(() => {
              this.$emit('prev')
              this.Timer = null
            }, 10)
          }
          break
        case 39:
          if (!this.Timer) {
            this.Timer = setTimeout(() => {
              this.$emit('next')
              this.Timer = null
            }, 10)
          }
          break
      }
    }
  },
  watch: {
    lastIndex () {
      this.computeShowList()
    },
    listenKeydown () {
      switch (this.listenKeydown) {
        case true:
          window.addEventListener('keydown', this.handelKeydown)
          break
        case false:
          window.removeEventListener('keydown', this.handelKeydown)
          break
      }
    }
  },
  mounted () {
    // swiper on方法中this作用域发生变化，故拷贝一份过去
    this.swiper._this = this
    this.computeShowList()
    window.addEventListener('keydown', this.handelKeydown)
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
      *
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
        padding: .3rem .2rem .3rem .63rem
        width: 80%
        word-break: break-all
        text-indent: -.33rem
        box-shadow: #e1e1e1 0 0 10px
        box-sizing: border-box
        cursor: pointer
      .select-yes /* 选对了的 */
        color: #fff
        background-color: #25C27D
      .noselect-answer /* 未选择的正确答案，多选题 */
        color: #fff
        background-color: #25C27D
        opacity: .5
      .select-no /* 选错了的 */
        color: #fff
        background-color: #FF7A7A
      .select-half /* 多选题不全对 */
        color: #fff
        background-color: #FDDC9A
      .select-assum /* 多选题预选 */
        color: #fff;
        background-color: #4390ee
      .submit /* 多选题确定按钮 */
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
        // border-radius: .5rem /* 不要圆角好像更合适 */
        opacity: .3
        cursor: pointer
        user-select: none
      .canSubmit /* 预选了两个选项之后的确定按钮 */
        opacity: 1
      .answerAndFraction /* 正确答案显示区域 */
        margin-top: .7rem
        padding: .3rem 0
        background-color: #f6f6f6
        text-indent: .2rem
        cursor: default
        .answer
          margin-right: .2rem
        .fraction
          margin-left: .2rem
</style>
