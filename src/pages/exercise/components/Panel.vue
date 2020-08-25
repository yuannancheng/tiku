<template>
  <div class="ExercisePanel">
    <div class="header">
      <div class="title">答题卡</div>
      <div class="goto">
        <input
          ref="indexInput"
          class="number"
          type="number"
          placeholder="题号"
          v-model="gotoIndex"
          @input="rewriteGotoIndex"
          @focus="inputFocus"
          @blur="inputBlur"
          @keydown.enter="jumpTest"
        />
        <div class="submit iconfont" @click="jumpTest">&#xe6cd;</div>
      </div>
      <div class="close iconfont" @click="closePanel">&#xe68b;</div>
    </div>
    <div class="content" ref="wrapper">
      <div>
        <template v-for="(type, className) of classList">
          <div class="className" :key="className">{{className}}</div>
          <template v-for="(range, typeName) of type">
            <div class="type" :key="className + '_' + typeName">{{typeName}}</div>
            <div class="idBox" :key="className + '_' + typeName + 'Box'">
              <span
                class="index"
                v-for="id of range"
                :key="id"
                :ref="id"
                @click="jumpTest(id + 1)"
              >{{id + 1}}</span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Bscroll from 'better-scroll'
export default {
  name: 'ExercisePanel',
  props: {
    DistributeData: {
      default: [0, 0, 100],
      validator (e) {
        return typeof (e[0] * 1) === 'number' && typeof (e[1] * 1) === 'number' && typeof (e[2] * 1) === 'number'
      }
    }
  },
  data () {
    return {
      gotoIndex: '',
      classList: {}
    }
  },
  watch: {
    TestDataIndex () {
      this.computeClassList()
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData', 'UserNote']),
    TestDataIndex () {
      return this.DistributeData[0]
    },
    lastIndex () {
      return this.DistributeData[1]
    },
    maxIndex () {
      return this.DistributeData[2]
    }
  },
  methods: {
    closePanel () {
      this.$emit('changeShowPanel', false)
    },
    rewriteGotoIndex () {
      var rewrite = this.gotoIndex.replace(/[^0-9]/g, '')
      // 使rewrite = int([1:maxIndex])|''
      rewrite = rewrite.length === 0 ? '' : rewrite * 1 > this.maxIndex + 1 ? this.maxIndex + 1 : rewrite * 1 > 0 ? rewrite : ''
      this.gotoIndex = rewrite
    },
    // 动态修改type，为了唤起数字键盘且用户输入非数字字符不被浏览器转成空值
    inputFocus () {
      setTimeout(() => {
        this.$refs.indexInput.type = 'text'
      }, 10)
    },
    inputBlur () {
      setTimeout(() => {
        this.$refs.indexInput.type = 'number'
      }, 10)
    },
    jumpTest (id) {
      id = typeof id === 'number' ? id : this.gotoIndex
      // 避免rewrite后内容为数字类型，无法判断length
      var strId = this.gotoIndex + ''
      if (strId.length > 0 || id) {
        this.$emit('jumpTest', id)
        this.gotoIndex = ''
        this.$refs.indexInput.blur()
      }
    },
    _activated () {
      if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.$refs.indexInput.focus()
      }
      window.addEventListener('keydown', this.handelKeydown)
      this.$nextTick(() => {
        const el = this.$refs[this.lastIndex][0]
        this.scroll.scrollToElement(el, 500, 0, -260)
      })
    },
    _deactivated () {
      window.removeEventListener('keydown', this.handelKeydown)
    },
    handelKeydown (e) {
      var keyCode = e.keyCode
      switch (keyCode) {
        case 27:
          this.closePanel()
          break
      }
    },
    computeClassList () {
      var list = {}
      var classData = this.TestData[this.TestDataIndex].class
      for (var className in classData) {
        if (!(className in list)) list[className] = {}
        for (var type in classData[className]) {
          var range = classData[className][type]
          type = type.split('_')[1]
          if (!(type in list[className])) list[className][type] = []
          for (var i = range[0]; i <= range[1]; i++) {
            list[className][type].push(i)
          }
        }
      }
      this.classList = list
    }
  },
  mounted () {
    this.computeClassList()
    this.scroll = new Bscroll(this.$refs.wrapper, {
      click: true,
      mouseWheel: true
    })
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .ExercisePanel
    position: fixed
    top: 0
    bottom: 0
    width: inherit
    background-color: #fff
    z-index: 2
    .header
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
      *
        display: inline-block
        padding: .1rem
        font-size: .34rem
        cursor: pointer
      .title,
      .goto,
      .close
        position: absolute
        top: 50%
        transform: translateY(-50%)
      .title
        left: .2rem
        color: #333
        font-size: .38rem
        font-weight: 900
        cursor: auto
      .goto
        position: relative
        width: 1.9rem
        .number,
        .submit
          position: absolute
          top: 50%
          transform: translateY(-50%)
        .number
          left: 0
          padding: .1rem
          width: 1.35rem
          height: .6rem
          font-size: .3rem
          text-align: center
          border: #eee 1px solid
          box-sizing: border-box
          cursor: text
        .submit
          right: 0
          font-size: .45rem
      .close
        right: .2rem
        font-size: .4rem
    .content
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-color: #fff
      overflow: hidden
      > div
        padding: .95rem .2rem 0
        cursor: default
        .className
          margin: .2rem 0 .1rem
          height: .95rem
          line-height: .95rem
          font-size: .37rem
          font-weight: 900
          color: #333
          background-color: #eee
          text-align: center
        .type
          padding: .2rem 0 .1rem
          border-bottom: #eee 1px solid
          font-size: .35rem
          text-indent: .2rem
        .idBox
          .index
            display: inline-block
            width: .8rem
            height: .8rem
            line-height: .8rem
            margin: .43rem
            padding: .1rem
            font-size: .34rem
            text-align: center
            box-shadow: #e1e1e1 0 0 10px
            cursor: pointer
</style>
