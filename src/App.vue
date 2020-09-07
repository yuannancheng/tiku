<template>
  <div id="app">
    <hot-key></hot-key>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import _functions from '@functions/_functions'
import HotKey from './pages/HotKey'
export default {
  name: 'App',
  components: {
    HotKey
  },
  computed: {
    ...mapState(['TestData', 'UserNote', 'UserData'])
  },
  watch: {
    TestData () {
      _functions.localStorageSetItem('TestData', this.TestData)
    },
    UserNote () {
      _functions.localStorageSetItem('UserNote', this.UserNote)
    },
    UserData () {
      _functions.localStorageSetItem('UserData', this.UserData)
    }
  },
  methods: {
    ...mapMutations(['TestDataOnload']), // 将this.$store.dispatch()映射成this.TestDataOnload(),同理还有 ...mapMutations
    getTestData () {
      axios.get('./static/TestData.json')
        .then(this.getTestDataSuccess)
    },
    getTestDataSuccess (res) {
      if (res.status === 200) {
        // 使用action执行异步修改/大量数据修改：this.$store.dispatch('TestDataOnload', res.data)
        // 使用mutation直接修改：this.$store.commit('TestDataOnload', res.data)
        this.TestDataOnload(res.data)
      }
    }
  },
  mounted () {
    this.getTestData()
    // window.addEventListener('touchmove', function (event) { event.preventDefault()} , { passive: false })
  }
}
</script>

<style lang="stylus" scoped>
  #app
    min-height: 100vh
    background-color: #fff
  @media (min-width: 700px)
    #app
      max-width: 700px
      margin: 0 auto
      background-color: #fff
      overflow-x: hidden
</style>
