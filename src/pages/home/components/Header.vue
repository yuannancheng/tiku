<template>
  <div class="header">
    <div class="header-left" @click="handleFeedBackClick">反馈</div>
    <div class="header-title">理论题库</div>
    <div class="header-right">
      <div class="header-import">
        导入
        <div class="header-import-list">
          <ul>
            <li title="仅支持json格式文件">导入题库
              <input
                class="importFileBtn"
                type="file"
                @change="importFileAddressChange"
                multiple
                accept=".json"
              />
            </li>
            <li>下载工具</li>
          </ul>
        </div>
      </div>
      <div>{{editBtnContent}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeHeader',
  data: function () {
    return {
      editBtnContent: '编辑'
    }
  },
  methods: {
    handleFeedBackClick: function () {
      alert('发现问题了？\n快来告诉我吧！')
    },
    importFileAddressChange: function (e) {
      console.log(e.target.files)
    }
  }
}
</script>

<!-- scoped 仅对当前组件产生影响 -->
<style lang="stylus" scoped>
  .header
    position: relative
    height: 1rem
    font-size: 0
    text-align: center
    color: #4ea1db
    background-color: #fff
    box-shadow: #ccc 0 0 7px
    user-select: none

    *
      display: inline-block
      padding: .1rem
      font-size: .35rem
      cursor: pointer

    .header-title,
    .header-left,
    .header-right
      position: absolute
      top: 50%
      transform: translateY(-50%)

    .header-title
      position: relative
      color: #333
      font-size: .4rem
      font-weight: 900
      cursor: auto

    .header-left
      left: .15rem

    .header-right
      right: .15rem
      padding: 0

      .header-import
        position: relative

        .header-import-list
          display: none
          position: absolute
          left: 50%
          top: 100%
          min-width: 2rem
          padding: .4rem 0 0
          transform: translateX(-50%)
          cursor: auto

          ul
            padding: .15rem 0 .05rem
            background-color: #fff
            border: #eee 1px solid
            border-radius: .1rem
            cursor: auto

            li
              position: relative
              word-break: keep-all
              overflow: hidden

              .importFileBtn
                position: absolute
                top: 0
                right: 0

      .header-import:hover .header-import-list
        display: inline-block
</style>
