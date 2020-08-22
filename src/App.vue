<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { localStorageSetItem } from './store/TestDataInit/localStorageSetItem'
export default {
  name: 'App',
  computed: {
    ...mapState(['TestData', 'UserNote', 'UserData'])
  },
  watch: {
    TestData () {
      console.log('监听到TestData发生变化，将要存储')
      localStorageSetItem('TestData', this.TestData)
    },
    UserNote () {
      console.log('监听到UserNote发生变化，将要存储')
      localStorageSetItem('UserNote', this.UserNote)
    },
    UserData () {
      console.log('监听到UserData发生变化，将要存储')
      localStorageSetItem('UserData', this.UserData)
    }
  },
  methods: {
    ...mapMutations(['TestDataOnload']), // 将this.$store.dispatch()映射成this.TestDataOnload(),同理还有 ...mapMutations
    getTestData () {
      axios.get('/api/TestData.json')
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
  }
  // 当使用了<keep-alive>时，第二次渲染组件会直接从内存中取得数据，
  // 如果某些数据需要刷新的话可以在activated这个生命周期钩子中执行
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
