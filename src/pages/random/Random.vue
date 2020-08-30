<template>
  <div class="random">
    <random-header :fromUrl="fromUrl"></random-header>
    <random-body @changeShowCreate="changeShowCreate"></random-body>
    <transition name="create">
      <random-create v-show="showCreate" @changeShowCreate="changeShowCreate"></random-create>
    </transition>
  </div>
</template>

<script>
import RandomHeader from './components/Header'
import RandomBody from './components/Body'
import RandomCreate from './components/Create'
export default {
  name: 'Random',
  components: {
    RandomHeader,
    RandomBody,
    RandomCreate
  },
  data () {
    return {
      fromUrl: '',
      showCreate: false
    }
  },
  methods: {
    changeShowCreate (value) {
      this.showCreate = value
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
