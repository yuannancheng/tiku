<template>
  <div class="under">
    <div class="under-prev iconfont" @click="prev">&#xe685;上一题</div>
    <div class="under-number" @click="showPanel">{{lastIndex + 1}}/{{maxIndex}}</div>
    <div class="under-next iconfont"  @click="next">下一题&#xe6eb;</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ExerciseUnder',
  props: {
    TestDataIndex: Number
  },
  computed: {
    ...mapState(['UserData']),
    lastIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return this.UserData.Random[this.TestDataIndex].lastIndex * 1
    },
    maxIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return this.UserData.Random[this.TestDataIndex].data.Test.length
    }
  },
  methods: {
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    },
    showPanel () {
      this.$emit('changeShowPanel', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@styles/varibles.styl'
  .under
    position: fixed
    z-index: 2
    bottom: 0
    width: inherit
    height: .95rem
    font-size: 0
    text-align: center
    color: $btnTxtColor
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    user-select: none
    *
      display: inline-block
      padding: .17rem .1rem
      cursor: pointer
    .under-prev,
    .under-number,
    .under-next
      position: absolute
      top: 50%
      transform: translateY(-50%)
      font-size: .38rem
    .under-number
      position: relative
    .under-prev
      left: .1rem
    .under-next
      right: .1rem
</style>
