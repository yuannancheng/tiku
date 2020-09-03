<template>
  <div class="HomeBackUp">
    <div class="wrap">
      <div class="close iconfont" @click="handelClose">&#xe68b;</div>
      <div class="backup" @click="handelBackUp">备份数据</div>
      <div class="import" title="恢复备份数据">
        恢复数据
        <input
          class="importFileBtn"
          type="file"
          @change="importFileAddressChange"
          accept="application/json"
        />
      </div>
      <div class="tip">
        备份做题数据、笔记数据 <br />
        导入后将覆盖本地已有数据，请谨慎操作。
      </div>
    </div>
  </div>
</template>

<script>
import _functions from '@functions/_functions'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HomeBackUp',
  computed: {
    ...mapState(['UserData', 'UserNote'])
  },
  methods: {
    ...mapMutations(['importBackUpData']),
    handelClose () {
      this.$emit('changeShowBackUp', false)
    },
    handelBackUp () {
      const data = {}
      data.UserData = this.UserData
      data.UserNote = this.UserNote
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)))
      element.setAttribute('download', '备份数据' + _functions.formatTime(new Date().getTime()).replace(/\W/g, '-') + '.json')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      this.handelClose()
    },
    importFileAddressChange (e) {
      let _this = this
      let file = e.target.files[0]
      if (file.name.split('.').slice(-1)[0] === 'json') {
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          var thisData = null
          try {
            thisData = JSON.parse(this.result)
          } catch (e) {}
          if (
            thisData &&
            'UserData' in thisData &&
            'UserNote' in thisData &&
            typeof thisData.UserData === 'object' &&
            typeof thisData.UserNote === 'object'
          ) {
            // 数据合格
            _this.importBackUpData(thisData)
            _this.handelClose()
            alert('数据恢复成功')
          } else {
            alert('\'' + file.name + '\' 不是预期的文件')
          }
        }
      } else {
        alert('\'' + file.name + '\' 不是json格式的文件')
      }
    }
  }
}
</script>

<style lang="stylus" scpoed>
  @import '~@styles/varibles.styl'
  .HomeBackUp
    position: fixed
    display: block
    width: inherit
    top: 0
    bottom: 0
    z-index: 2
    background-color: transparent
    user-select: none
    &::before
      content: ''
      position: absolute
      top: 0
      right: 0
      width: 100%
      height: 100%
      backdrop-filter: blur(5px) brightness(90%)
    .wrap
      position: relative
      width: 80%
      height: 6rem
      padding: .3rem
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      background-color: #fff
      box-sizing: border-box
      text-align: center
      .close
        position: absolute
        top: .1rem
        right: .1rem
        padding: .2rem
        font-size: .4rem
        color: $btnTxtColor
        cursor: pointer
      .backup,
      .import
        position: relative
        margin: .5rem auto
        width: 60%
        height: 1.3rem
        line-height: 1.3rem
        text-align: center
        font-size: .34rem
        font-weight: 900
        background-color: #eee
        user-select: pointer
        overflow: hidden
        white-space: nowrap
        cursor: pointer
        .importFileBtn
          position: absolute
          right: 0
          top: 0
          width: 500%
          height: 100%
          cursor: pointer
      .tip
        display: inline-block
        font-size: 12px
        text-align: left
</style>
