<template>
  <div class="WriteNoteBtn iconfont">
    <transition name="WriteNoteBtn">
      <div
        v-show="showWriteNoteBtn"
        :class="showOrHide()"
        @click="handelBtnClick"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
      >&#xe63e;</div>
    </transition>
  </div>
</template>

<script>
import _functions from '@functions/_functions'
export default {
  name: 'RandomWriteNoteBtn',
  props: {
    showWriteNoteBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      timer: null
    }
  },
  methods: {
    showOrHide () {
      var className = ['button']
      if (this.show) {
        className.push('show')
      } else {
        className.push('hide')
      }
      return className
    },
    handelBtnClick () {
      if (this.show) {
        this.$emit('changeShowEdit', true)
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.show = false
            this.timer = null
          }, 2000)
        }
      } else {
        this.show = true
        this.timer = setTimeout(() => {
          this.show = false
          this.timer = null
        }, 2000)
      }
    },
    mouseEnter () {
      // 如果不是PC，就啥也不做
      if (_functions.IsPC()) {
        if (!this.show) {
          this.show = true
        } else {
          if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
        }
      }
    },
    mouseLeave () {
      if (_functions.IsPC()) {
        this.timer = setTimeout(() => {
          this.show = false
          this.timer = null
        }, 2000)
      }
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .WriteNoteBtn-enter,
  .WriteNoteBtn-leave-to
    transform: translateX(100%)
    opacity: 1
  .WriteNoteBtn-enter-to,
  .WriteNoteBtn-leave
    transform: translateX(0)
    opacity: 1

  .WriteNoteBtn
    position: fixed
    pointer-events: none
    width: inherit
    height: 2.2rem
    bottom: 0
    z-index: 3
    overflow-x: hidden
    .button
      position: absolute
      pointer-events: auto
      bottom: 1.2rem
      width: 1rem
      height: 1rem
      line-height: 1rem
      font-size: .8rem
      color: #4390ee
      background-color: #fff
      text-align: right
      border: #4390ee .8px solid
      border-radius: 50% 0 0 50%
      border-right: none
      box-sizing: border-box
      transition: .5s
      z-index: 3
      cursor: pointer
    .show
      right: 0
    .hide
      right: -.5rem
      opacity: .5
</style>
