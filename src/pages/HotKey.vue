<template>
  <div class="HotKey" :style="HotKeyStyle">
    <div class="wrap">
      <div class="title">快捷键</div>
      <div class="scenes" v-for="(item1, key1) of key" :key="key1">
        <div class="scenes-name">{{key1}}</div>
        <div class="item" v-for="(item2, key2) of item1" :key="key2">
          <span class="name">{{key2}}</span>：
          <span class="data">{{item2}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotKey',
  data () {
    return {
      vw: 0,
      timer: null,
      key: {
        '答题界面': {
          '上一题': '←',
          '下一题': '→',
          '答题卡': 'Space',
          '笔记': 'W'
        },
        '笔记界面': {
          '退出': 'Esc',
          '保存': 'Ctrl + Enter'
        },
        '答题卡界面': {
          '退出': 'Esc'
        }
      }
    }
  },
  computed: {
    HotKeyStyle () {
      return {
        width: (this.vw - 700) / 2 + 'px'
      }
    }
  },
  mounted () {
    this.vw = document.body.clientWidth
    window.onresize = () => {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.vw = document.body.clientWidth
          this.timer = null
        }, 50)
      }
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .HotKey
    display: none
    position: absolute
    right: 0
    top: 0
    height: 300px
    box-sizing: border-box
    .wrap
      float: left
      margin-top: .2rem
      margin-left: 3rem
      max-width: 200px
      background-color: #fff
      overflow: hidden
      white-space: nowrap
      .title
        padding: .2rem 0 .1rem
        font-weight: 900
        font-size: .36rem
        text-align: center
      .scenes
        margin: .1rem
        padding: .1rem
        box-sizing: border-box
        background-color: #eee
        overflow: hidden
        .scenes-name
          font-size: .34rem
          font-weight: 900
          margin-bottom: .2rem
        .item
          padding: .05rem .2rem
          font-size: .28rem
          width: inherit
          box-sizing: border-box
          color: #666
          .name
            display: inline-block
            width: 60px
            text-align-last: justify
            text-align: justify
            text-justify: distribute-all-lines
          .data
            color: #666

  @media (min-width: 700px)
    .HotKey
      display: inline-block
</style>
