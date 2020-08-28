<template>
  <div class="NoteEdit">
    <div class="wrap">
      <div class="header">
        <div class="title">写笔记</div>
        <div class="tip">
          <div class="info">支持markdown语法</div>
          <a class="whatIs">什么是markdown？</a>
        </div>
      </div>
      <textarea
        ref="Edit"
        class="Edit"
        v-model="noteContent"
        placeholder="在此输入笔记，输入空值即可删除原有笔记"
      ></textarea>
      <div class="submit" @click="submit">保存</div>
      <div class="cancel" @click="cancel">取消</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'NoteEdit',
  props: {
    TestDataIndex: {
      default: 0,
      validator (e) {
        return typeof (e * 1) === 'number'
      }
    },
    lastIndex: {
      default: 0,
      validator (e) {
        return typeof (e * 1) === 'number'
      }
    },
    showEdit: Boolean
  },
  data () {
    return {
      noteContent: ''
    }
  },
  watch: {
    lastIndex () {
      this.loadLocalStorage()
    }
  },
  computed: {
    ...mapState(['UserNote'])
  },
  methods: {
    ...mapMutations(['setUserNote']),
    loadLocalStorage () {
      if (
        this.TestDataIndex in this.UserNote &&
        this.lastIndex in this.UserNote[this.TestDataIndex]
      ) {
        this.noteContent = this.UserNote[this.TestDataIndex][this.lastIndex]
      } else {
        this.noteContent = ''
      }
    },
    submit () {
      if (
        this.TestDataIndex in this.UserNote &&
        this.lastIndex in this.UserNote[this.TestDataIndex]
      ) {
        if (this.noteContent !== this.UserNote[this.TestDataIndex][this.lastIndex]) {
          this.setUserNote([this.TestDataIndex, this.lastIndex, this.noteContent])
        }
      } else if (this.noteContent !== '') {
        this.setUserNote([this.TestDataIndex, this.lastIndex, this.noteContent])
      }
      this.$emit('changeShowEdit', false)
    },
    cancel () {
      this.$emit('changeShowEdit', false)
    },
    handelKeydown (e) {
      var keyCode = e.keyCode
      var ctrl = e.ctrlKey
      switch (keyCode) {
        case 27: // Esc键
          this.cancel()
          break
        case 13: // Ctrl + Enter组合键
          if (ctrl) this.submit()
          break
      }
    },
    _activated () {
      setTimeout(() => {
        this.$refs.Edit.focus()
      }, 10)
      window.addEventListener('keydown', this.handelKeydown)
    },
    _deactivated () {
      window.removeEventListener('keydown', this.handelKeydown)
    }
  },
  mounted () {
    this.loadLocalStorage()
  }
}
</script>

<style lang="stylus" scpoed>
  .NoteEdit
    position: fixed
    width: inherit
    top: 0
    bottom: 0
    background-color: rgba(0, 0, 0, 0.45)
    z-index: 3
    .wrap
      position: relative
      width: 80%
      height: 80%
      padding: 1.2rem .3rem 1.5rem
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      background-color: #fff
      box-sizing: border-box
      .header
        position: absolute
        height: 1.2rem
        top: 0
        left: .3rem
        right: .3rem
        padding: .1rem 0 0
        .title
          padding: .2rem 0 .1rem
          font-size: .38rem
          font-weight: 900
          color: #333
          user-select: none
        .tip
          display: inline-block
          > *
            display: inline-block
            font-size: .22rem
          .info
            margin-left: .2rem
            margin-right: .15rem
            color: #666
          .whatIs
            cursor: pointer
            user-select: none
      .submit,
      .cancel
        position: absolute
        bottom: .4rem
        height: .7rem
        width: 1.5rem
        line-height: .7rem
        text-align: center
        font-size: .35rem
        box-shadow: #e6e6e6 0 0 7px
        cursor: pointer
        user-select: none
      .submit
        right: 2.1rem
        color: #fff
        background-color: #4390ee
      .cancel
        right: .4rem
        color: #333
        background-color: #fff
      .Edit
        display: block
        width: 100%
        height: 100%
        padding: .15rem
        color: #333
        font-size: .34rem
        letter-spacing: 0.01rem
        border: #eee 1px solid
        box-sizing: border-box
        word-break: break-all
        outline: none
        resize: none
</style>
