<template>
  <div class="random-header">
    <div class="back iconfont" @click="backExercise">&#xe602;</div>
    <div class="title">抽题</div>
  </div>
</template>

<script>
export default {
  name: 'RandomHeader',
  props: {
    fromUrl: String
  },
  methods: {
    backExercise () {
      console.log(this.fromUrl)
      if (this.fromUrl === '') {
        this.$router.push('/exercise/')
      } else {
        this.$router.push(this.fromUrl)
      }
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .random-header
    position: fixed
    width: inherit
    height: .95rem
    top: 0
    font-size: 0
    text-align: center
    color: $btnTxtColor
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    z-index: 1
    user-select: none
    .back,
    .title
      display: inline-block
      position: absolute
      top: 50%
      transform: translateY(-50%)
      padding: .1rem
    .back
      left: .15rem
      font-size: .45rem
      cursor: pointer
    .title
      position: relative
      font-size: .38rem
      font-weight: 900
      color: #333
</style>
