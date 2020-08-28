<template>
  <div class="seach">
    <div class="input-warp">
      <input class="input" ref="input" v-model="keyWord" placeholder="搜索题目和笔记…" />
      <div class="close iconfont" @click="closeSeach">&#xe68b;</div>
    </div>
    <div :class="contentClassName()" ref="content">
      <ul>
        <li v-show="!noData" class="results">共找到{{seachContent.length}}个匹配项</li>
        <li v-for="(item, index) of seachContent" :key="index" @click="jumpTest(item.id * 1 + 1)">
          <div class="SeachItem">
            <div class="type">{{item.type}}</div>
            <div class="contentBox">
              <div class="index">{{item.id * 1 + 1}}. </div>
              <div class="content" v-html="item.content"></div>
            </div>
          </div>
        </li>
      </ul>
      <div ref="tip" v-show="noData" class="noData"></div>
    </div>
    <div v-show="showCtrlBtn" :class="ctrlBtnClassName()" @click="changeShowContent" v-html="ctrlBtnIcon"></div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import { mapState } from 'vuex'
export default {
  name: 'ExerciseSeach',
  props: {
    TestDataIndex: Number
  },
  data () {
    return {
      showContent: true,
      ctrlBtnIcon: '&#xe6ed;',
      keyWord: '',
      seachContent: [],
      timer: null
    }
  },
  watch: {
    keyWord () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.$refs.tip.innerText = '搜索中…'
        this.SeachKeyWord()
      }, 100)
    },
    seachContent () {
      this.scroll.refresh()
      this.changeShowContent(true)
    }
  },
  computed: {
    ...mapState(['TestData', 'UserNote']),
    showCtrlBtn () {
      if (this.keyWord.length > 0) {
        return true
      } else {
        return false
      }
    },
    noData () {
      return this.keyWord.length > 0 && this.seachContent.length === 0
    }
  },
  methods: {
    contentClassName () {
      var className = ['ContentBox']
      if (this.showContent && this.showCtrlBtn) {
        className.push('more')
      } else {
        className.push('less')
      }
      return className
    },
    ctrlBtnClassName () {
      var className = ['ctrlBtn', 'iconfont']
      if (this.showContent) {
        className.push('ctrlBtnMore')
      } else {
        className.push('ctrlBtnLess')
      }
      return className
    },
    closeSeach () {
      this.keyWord = ''
      this.$emit('changeShowSeach', false)
    },
    changeShowContent (value) {
      value = typeof value === 'boolean' ? value : !this.showContent
      this.showContent = value
      if (value === true) {
        this.ctrlBtnIcon = '&#xe6ed;'
      } else if (value === false) {
        this.ctrlBtnIcon = '&#xe6ec;'
      }
    },
    stopPrevent (e) {
      e.preventDefault()
    },
    SeachKeyWord () {
      if (this.keyWord.length >= 1) {
        var list = []
        var reg = new RegExp(this.keyWord)
        this.TestData[this.TestDataIndex].data.forEach((e) => {
          var id = e.id
          var thisList = {
            'id': id,
            'type': '题目',
            'content': ''
          }
          if (e.title.indexOf(this.keyWord) !== -1) {
            thisList.content += e.title
          }
          e.选项.forEach((f) => {
            if (f.indexOf(this.keyWord) !== -1) {
              thisList.content += f
            }
          })
          if (thisList.content.length > 1) {
            var position = thisList.content.indexOf(this.keyWord)
            if (position > 8) {
              thisList.content = '...' + thisList.content.substring(position - 5, thisList.content.length)
            }
            thisList.content = thisList.content.replace(reg, '<span class="key">' + this.keyWord + '</span>')
            list.push(thisList)
          }
        })
        if (this.TestDataIndex in this.UserNote) {
          for (var key in this.UserNote[this.TestDataIndex]) {
            var thisNote = this.UserNote[this.TestDataIndex][key]
            var position = thisNote.indexOf(this.keyWord)
            if (position > -1) {
              var thisList = {
                'id': key,
                'type': '笔记',
                'content': ''
              }
              if (position > 8) {
                thisNote = '...' + thisNote.substring(position - 5, thisNote.length)
              }
              thisList.content += thisNote.replace(reg, '<span class="key">' + this.keyWord + '</span>')
              list.push(thisList)
            }
          }
        }
        this.seachContent = list
        if (list.length === 0) this.$refs.tip.innerText = '没有找到匹配项…'
      } else this.seachContent = []
    },
    jumpTest (id) {
      this.$refs.input.blur()
      this.changeShowContent()
      this.$emit('jumpTest', id)
    }
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.content, {
      click: true,
      mouseWheel: true
    })
  }
}
</script>

<style lang="stylus" scpoed>
  .seach
    pointer-events: none
    position: fixed
    top: 0
    width: inherit
    padding-top: .95rem
    z-index: 3
    .input-warp
      pointer-events: auto
      position: absolute
      top: 0
      height: 0.95rem
      width: 100%
      .input
        width: 100%
        height: .95rem
        padding: .2rem
        padding-right: 1.15rem
        line-height: .95rem
        font-size: .34rem
        box-sizing: border-box
      .close
        position: absolute
        right: 0
        top: 0
        width: .95rem
        height: .95rem
        line-height: .95rem
        text-align: center
        cursor: pointer
    .ContentBox
      pointer-events: auto
      position: relative
      width: 100%
      padding: 0 .2rem
      box-sizing: border-box
      background-color: #fff
      transition: .3s
      overflow: hidden
      .noData
        color: black
      .results
        color: black
      .SeachItem
        position: relative
        width: 100%
        height: 1rem
        margin: .1rem 0
        padding: 0 0 0 .8rem
        box-sizing: border-box
        border: #eee 2px solid
        background-color: #fff
        cursor: pointer
        overflow: hidden
        .type
          position: absolute
          top: 0
          left: 0
          width: .8rem
          height: 1rem
          line-height: .31rem
          text-align: center
          padding: .2rem
          border-right: #eee 1px solid
          box-sizing: border-box
          user-select: none
        .contentBox
          height: 1rem
          width: 100%
          padding: .2rem
          line-height: .6rem
          box-sizing: border-box
          white-space: nowrap
          overflow-x: hidden
          text-overflow: ellipsis
          > *
            font-size: .3rem
          .index
            display: inline
          .content
            display: inline
            .key
              color: red
    .more
      height: 70vh
    .less
      height: 0
    .ctrlBtn
      pointer-events: auto
      font-size: .5rem
      text-align: center
      user-select: none
      cursor: pointer
    .ctrlBtnMore
      height: .5rem
      line-height: .5rem
      background-color: #EEEEEE
      width: 100%
    .ctrlBtnLess
      position: absolute
      right: .95rem
      top: 0
      height: .95rem
      line-height: .95rem
      background-color: #fff
      width: .95rem
</style>
