<template>
  <div class="Header">
    <div class="duration" v-html="duration"></div>
    <div class="close iconfont" @click="close">&#xe68b;</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _functions from '@functions/_functions'
export default {
  name: 'RandomExerciseHeader',
  props: {
    TestDataIndex: Number
  },
  computed: {
    ...mapState(['UserData']),
    duration () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return _functions.timeDifference(this.UserData.Random[this.TestDataIndex].duration)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .Header
    position: fixed
    z-index: 2
    top: 0
    width: inherit
    height: .95rem
    font-size: 0
    text-align: center
    color: $btnTxtColor
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    user-select: none
    .duration
      position: absolute
      display: inline-block
      top: 50%
      left: .2rem
      transform: translateY(-50%)
      font-size: .38rem
    .close
      position: absolute
      display: inline-block
      padding: .2rem
      top: 50%
      right: .15rem
      transform: translateY(-50%)
      font-size: .38rem
      cursor: pointer
</style>
