<template>
  <div class="body">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>214534</swiper-slide>
    </swiper>
    <div>测试数据：{{test}}</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ExerciseBody',
  props: {
    TestDataIndex: {
      default: 0,
      validator (e) {
        return typeof (e * 1) === 'number'
      }
    }
  },
  data () {
    return {
      swiperOptions: {
      }
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData', 'UserNote']),
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    test () {
      return this.UserData['1'].lastIndex
    }
  },
  methods: {
    ...mapMutations([])
  },
  beforeUpdate () {
  },
  mounted () {
    // swiper on方法中this作用域发生变化，故拷贝一份过去
    this.swiper._this = this
  }
}
</script>

<style lang="stylus" scpoed>
  .body
    background-color: #fff
    *
      height: 4rem
</style>
