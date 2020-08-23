<template>
  <div class="Exercise">
    <exercise-header :TestDataIndex="TestDataIndex"></exercise-header>
    <exercise-body
      :DistributeData="[TestDataIndex, lastIndex, maxIndex]"
      ref="ExerciseBody"
    ></exercise-body>
    <exercise-under
      :lastIndex="lastIndex + 1"
      :maxIndex="maxIndex + 1"
      @prev="prev"
      @next="next"
    ></exercise-under>
  </div>
</template>

<script>
import ExerciseHeader from './components/Header'
import ExerciseBody from './components/Body'
import ExerciseUnder from './components/Under'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Exercise',
  components: {
    ExerciseHeader,
    ExerciseBody,
    ExerciseUnder
  },
  data () {
    return {
      lastRouteId: 0,
      propsShowIndexList: {}
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData']),
    TestDataIndex () {
      if (this.$route.name === 'Exercise') {
        return this.$route.params.id * 1
      }
      return this.lastRouteId
      /*
       * 泪了。。。从答题界面返回主页后，路由发生变化，导致页面携带参数发生变化，所以TestDataIndex重新计算,
       * 但是回到主页后TestDataIndex计算结果必定为undefind，又导致lastIndex重新计算错误，还会影响Body页面错误
       * 故在此判断路由地址，如果不是答题界面，就返回上一次页面携带的参数，所有的结果也就不会重新计算了
      */
    },
    lastIndex () {
      if (this.UserData && this.TestDataIndex in this.UserData) {
        return this.UserData[this.TestDataIndex].lastIndex
      } else {
        // 第一次做题库
        this.initUserData(this.TestDataIndex)
        return 0
      }
    },
    maxIndex () {
      return this.TestData[this.TestDataIndex].data.length - 1
    }
  },
  watch: {
    TestDataIndex () {
      // 路由发生变化，保存路由携带参数
      this.lastRouteId = this.TestDataIndex
    }
  },
  methods: {
    ...mapMutations(['initUserData']),
    prev () {
      // 调用this.$refs.ExerciseBody 里的方法
      this.$refs.ExerciseBody.swiper.slidePrev()
    },
    next () {
      this.$refs.ExerciseBody.swiper.slideNext()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .Exercise
    width: 100%
    min-height: 100vh
    padding: .95rem 0
    box-sizing: border-box
  @media (min-width: 700px)
    .Exercise
      width: 700px
</style>
