<template>
  <div>
    <home-header></home-header>
    <div v-for="(item, index) of this.TestData" :key="index">{{item.title}}</div>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Home',
  components: {
    HomeHeader
  },
  computed: {
    // 将this.$store.state.TestData映射成this.TestData
    ...mapState({
      TestData: 'TestData'
    })
  },
  methods: {
    getTestData () {
      axios.get('/api/TestData.json')
        .then(this.getTestDataSuccess)
    },
    getTestDataSuccess (res) {
      console.log(res.status)
      if (res.status === 200) {
        // 使用action执行异步修改/大量数据修改：this.$store.dispatch('TestDataOnload', res.data)
        // 使用mutation直接修改：this.$store.commit('TestDataOnload', res.data)
        this.TestDataOnload(res.data)
      }
    },
    // 将this.$store.dispatch()映射成this.TestDataOnload()
    // 之后可通过this.TestDataOnload调用this.$store.dispatch()
    // 且无需再传第一个参数，原理未知？
    // 同理还有 ...mapMutations
    ...mapActions(['TestDataOnload'])
  },
  mounted () {
    this.getTestData()
  }
  // 当使用了<keep-alive>时，第二次渲染组件会直接从内存中取得数据，
  // 如果某些数据需要刷新的话可以在activated这个生命周期钩子中执行
}
</script>

<style>

</style>
