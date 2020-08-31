<template>
  <div class="Home">
    <home-header
      :showDeleteBtn="showDeleteBtn"
      @changeShowDeleteBtn="changeShowDeleteBtn"
      @changeShowBackUp="changeShowBackUp"
    ></home-header>
    <home-list :showDeleteBtn="showDeleteBtn"></home-list>
    <home-back-up v-show="showBackUp" @changeShowBackUp="changeShowBackUp"></home-back-up>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeList from './components/List'
import HomeBackUp from './components/BackUp'
export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeList,
    HomeBackUp
  },
  data () {
    return {
      showDeleteBtn: false,
      showBackUp: false
    }
  },
  methods: {
    changeShowDeleteBtn (value) {
      this.showDeleteBtn = value
    },
    changeShowBackUp (value) {
      this.showBackUp = value
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .Home
    width: 100%
    padding-top: .95rem
    background-color: #fff
  @media (min-width: 700px)
    .Home
      width: 700px
</style>
