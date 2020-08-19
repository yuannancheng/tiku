<template>
  <div>
    <div v-for="(item, index) of this.TestData" :key="index">{{item.title}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomeList',
  computed: {
    // 将this.$store.state.TestData映射成this.TestData
    ...mapState({
      TestData: 'TestData'
    })
  }
}
</script>

<style lang="stylus" scoped>
</style>
