<template>
  <div class="under">
    <div class="under-prev iconfont" @click="prev">&#xe685;上一题</div>
    <div class="under-number">-/-</div>
    <div class="under-next iconfont"  @click="next">下一题&#xe6eb;</div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseUnder',
  methods: {
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
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
      padding: .1rem
      font-size: .34rem
      cursor: pointer
    .under-prev,
    .under-number,
    .under-next
      position: absolute
      top: 50%
      transform: translateY(-50%)
    .under-number
      position: relative
    .under-prev
      left: .1rem
      font-size: .36rem
    .under-next
      right: .1rem
      font-size: .36rem
</style>
