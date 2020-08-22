<template>
  <div class="Exercise">
    <exercise-header :TestDataIndex="TestDataIndex"></exercise-header>
    <exercise-body
      :TestDataIndex="TestDataIndex"
    ></exercise-body>
    <exercise-under
      :TestDataIndex="TestDataIndex"
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
        // console.log('初始化数据', this.TestDataIndex)
        this.initUserData(this.TestDataIndex)
        // console.log(this.UserData)
        return 0
      }
    },
    maxIndex () {
      return this.TestData[this.TestDataIndex].data.length
    }
  },
  watch: {
    TestDataIndex () {
      this.lastRouteId = this.TestDataIndex
      // console.log('路由发生变化')
    },
    lastIndex () {
      console.log('发生了变化', this.lastIndex, this.TestDataIndex)
    }//,
    // showIndexList () {
    //   console.log('发生了变化')
    // }
  },
  methods: {
    ...mapMutations(['initUserData', 'changeTest']),
    prev () {
      console.log('即将更新', this.UserData['1'].lastIndex)
      // this.$set(this.UserData['1'], 'lastIndex', 8)
      this.changeTest([1, 9])
      console.log('更新完毕', this.UserData['1'].lastIndex)
      console.log('为啥vux更新了，没把数据推送到App.vue的监听里，但是推送到了咱这页面上呢？')
      // this.showIndexList(this.lastIndex - 1)
    },
    next () {
      // this.showIndexList(this.lastIndex + 1)
    }//,
    // showIndexList (id) {
    //   var showIndexList = {avtiveId: 1, list: []}
    //   if (id < 1) {
    //     showIndexList.avtiveId = 0
    //     showIndexList.list[0] = 0
    //     showIndexList.list[1] = 1
    //     return showIndexList
    //   } else if (id > this.maxIndex) {
    //     showIndexList.list[0] = this.maxIndex - 1
    //     showIndexList.list[1] = this.maxIndex
    //     return showIndexList
    //   } else {
    //     showIndexList.list[0] = id - 1
    //     showIndexList.list[1] = id
    //     showIndexList.list[2] = id + 1
    //     return showIndexList
    //   }
    // }
  },
  mounted () {
    console.log('mounted', this.lastIndex, this.TestDataIndex)
  }
}
</script>

<style lang="stylus" scoped>
  .Exercise
    width: 100%
    padding: .95rem 0
  @media (min-width: 700px)
    .Exercise
      width: 700px
</style>
