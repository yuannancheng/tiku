<template>
  <div class="Exercise">
    <exercise-header :TestDataIndex="TestDataIndex" @changeShowSeach="changeShowSeach"></exercise-header>
    <exercise-body
      :DistributeData="[TestDataIndex, lastIndex, maxIndex]"
      :listenKeydown="BodyListenKeydown"
      :showWriteNoteBtn="showWriteNoteBtn"
      ref="ExerciseBody"
      @prev="prev"
      @next="next"
      @changeShowPanel="changeShowPanel"
      @changeShowEdit="changeShowEdit"
    ></exercise-body>
    <exercise-under
      :lastIndex="lastIndex + 1"
      :maxIndex="maxIndex + 1"
      @prev="prev"
      @next="next"
      @changeShowPanel="changeShowPanel"
    ></exercise-under>
    <transition name="Panel">
      <exercise-panel
        v-show="showPanel"
        ref="ExercisePanel"
        :DistributeData="[TestDataIndex, lastIndex, maxIndex]"
        @changeShowPanel="changeShowPanel"
        @jumpTest="jumpTest"
      ></exercise-panel>
    </transition>
    <write-note-btn
      :showWriteNoteBtn="showWriteNoteBtn"
      @changeShowEdit="changeShowEdit"
    ></write-note-btn>
    <note-edit
      v-show="showEdit"
      ref="Edit"
      :TestDataIndex="TestDataIndex"
      :lastIndex="lastIndex"
      @changeShowEdit="changeShowEdit"
    ></note-edit>
    <transition name="Seach">
      <exercise-seach
        v-show="showSeach"
        :TestDataIndex="TestDataIndex"
        @changeShowSeach="changeShowSeach"
        @jumpTest="jumpTest"
      ></exercise-seach>
    </transition>
  </div>
</template>

<script>
import ExerciseHeader from './components/Header'
import ExerciseBody from './components/Body'
import ExerciseUnder from './components/Under'
import ExercisePanel from './components/Panel'
import WriteNoteBtn from './components/WriteNoteBtn'
import NoteEdit from './components/Edit'
import ExerciseSeach from './components/Seach'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Exercise',
  components: {
    ExerciseHeader,
    ExerciseBody,
    ExerciseUnder,
    ExercisePanel,
    WriteNoteBtn,
    NoteEdit,
    ExerciseSeach
  },
  data () {
    return {
      lastRouteId: 0,
      propsShowIndexList: {},
      showPanel: false,
      lastShowPanel: null,
      BodyListenKeydown: true,
      showEdit: false,
      showSeach: false
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
    },
    showWriteNoteBtn () {
      return this.TestDataIndex in this.UserData && this.lastIndex in this.UserData[this.TestDataIndex].data
    }
  },
  watch: {
    TestDataIndex () {
      // 路由发生变化，保存路由携带参数
      this.lastRouteId = this.TestDataIndex
    }
  },
  methods: {
    ...mapMutations(['initUserData', 'setTestLastIndex']),
    prev () {
      this.$refs.ExerciseBody.swiper.slidePrev()
    },
    next () {
      this.$refs.ExerciseBody.swiper.slideNext()
    },
    changeShowPanel (value) {
      this.showPanel = value
      if (value === true) {
        this.BodyListenKeydown = false
        this.$nextTick(() => {
          this.$refs.ExercisePanel._activated()
        })
      } else if (value === false) {
        this.BodyListenKeydown = true
        this.$nextTick(() => {
          this.$refs.ExercisePanel._deactivated()
        })
      }
      if (this.showSeach === true) this.showSeach = false
    },
    jumpTest (id) {
      id = id - 1
      this.setTestLastIndex([this.TestDataIndex, id])
      this.BodyListenKeydown = true
      if (this.showPanel === true) {
        this.showPanel = false
        this.$nextTick(() => {
          this.$refs.ExercisePanel._deactivated()
        })
      }
    },
    changeShowEdit (value) {
      this.showEdit = value
      if (value === true) {
        this.BodyListenKeydown = false
        this.$nextTick(() => {
          this.$refs.Edit._activated()
        })
      } else if (value === false) {
        this.BodyListenKeydown = true
        this.$nextTick(() => {
          this.$refs.Edit._deactivated()
        })
      }
      if (this.showSeach === true) this.showSeach = false
    },
    changeShowSeach (value) {
      this.showSeach = value
      if (value === true) {
        this.BodyListenKeydown = false
      } else if (value === false) {
        this.BodyListenKeydown = true
      }
    }
  },
  activated () {
    if (this.lastShowPanel === true) {
      this.$refs.ExercisePanel._activated()
    } else {
      this.BodyListenKeydown = true
    }
  },
  deactivated () {
    if (this.showPanel === true) {
      this.lastShowPanel = true
      this.$refs.ExercisePanel._deactivated()
    } else {
      this.lastShowPanel = null
      this.BodyListenKeydown = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .Panel-enter,
  .Panel-leave-to
    transform: translateY(100%)
    // opacity: 0
  .Panel-enter-to,
  .Panel-leave
    transform: translateY(0)
    // opacity: 1
  .Panel-enter-active,
  .Panel-leave-active
    transition: .3s

  .Seach-enter,
  .Seach-leave-to
    transform: translateY(-100%)
  .Seach-enter-to,
  .Seach-leave
    transform: translateY(0)
  .Seach-enter-active,
  .Seach-leave-active
    transition: .3s

  .Exercise
    position: relative
    width: 100%
    min-height: 100vh
    padding: .95rem 0
    box-sizing: border-box
  @media (min-width: 700px)
    .Exercise
      width: 700px
</style>
