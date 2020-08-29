<template>
  <div class="random">
    <random-header :fromUrl="fromUrl"></random-header>
    <random-body></random-body>
  </div>
</template>

<script>
import RandomHeader from './components/Header'
import RandomBody from './components/Body'
export default {
  name: 'Random',
  components: {
    RandomHeader,
    RandomBody
  },
  data () {
    return {
      fromUrl: ''
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
  .random
    width: 100%
    padding-top: .95rem
    background-color: #fff
  @media (min-width: 700px)
    .random
      width: 700px
</style>
