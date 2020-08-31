<template>
  <div class="random">
    <random-header v-show="!showExercise" :fromUrl="fromUrl"></random-header>
    <random-body
      v-show="!showExercise"
      @changeShowCreate="changeShowCreate"
      @changeTestDataIndex="changeTestDataIndex"
      @changeShowExercise="changeShowExercise"
    ></random-body>
    <transition name="create">
      <random-create
        v-show="showCreate"
        @changeShowCreate="changeShowCreate"
        @changeTestDataIndex="changeTestDataIndex"
        @changeShowExercise="changeShowExercise"
      ></random-create>
    </transition>
    <random-exercise
      v-show="showExercise"
      ref="RandomExercise"
      :showExercise="showExercise"
      :TestDataIndex="TestDataIndex"
      @changeShowExercise="changeShowExercise"
    ></random-exercise>
  </div>
</template>

<script>
import RandomHeader from './components/Header'
import RandomBody from './components/Body'
import RandomCreate from './components/Create'
import RandomExercise from './components/RandomExercise'
export default {
  name: 'Random',
  components: {
    RandomHeader,
    RandomBody,
    RandomCreate,
    RandomExercise
  },
  data () {
    return {
      fromUrl: '',
      showCreate: false,
      showExercise: false,
      TestDataIndex: 0
    }
  },
  methods: {
    changeShowCreate (value) {
      this.showCreate = value
    },
    changeShowExercise (value) {
      this.showExercise = value
    },
    changeTestDataIndex (value) {
      if (value === true) {
        this.TestDataIndex = 0
        this.$refs.RandomExercise.$refs.RandomExercisePanel.computeTestList()
      } else {
        this.TestDataIndex = value
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromUrl = from.path
    })
  }
}
</script>

<style lang="stylus" scoped>
  .create-enter,
  .create-leave-to
    transform: translateY(-100%)
  .create-enter-to,
  .create-leave
    transform: translateY(0)
  .create-enter-active,
  .create-leave-active
    transition: .3s

  .random
    width: 100%
    padding-top: .95rem
    background-color: #fff
    min-height: 100vh
    box-sizing: border-box
  @media (min-width: 700px)
    .random
      width: 700px
</style>
