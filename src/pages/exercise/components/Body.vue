<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide>
      <swiper-slide>Slide 5</swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
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
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  computed: {
    ...mapState(['TestData', 'UserData', 'UserNote']),
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    ...mapMutations([])
  }
}
</script>

<style lang="stylus" scpoed>
</style>
