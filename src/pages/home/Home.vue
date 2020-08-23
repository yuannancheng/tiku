<template>
  <div class="Home">
    <home-header :showDeleteBtn="showDeleteBtn" @changeShowDeleteBtn="changeShowDeleteBtn"></home-header>
    <home-list :showDeleteBtn="showDeleteBtn"></home-list>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeList from './components/List'
export default {
  name: 'Home',
  components: {
    HomeHeader,
    HomeList
  },
  data () {
    return {
      showDeleteBtn: false
    }
  },
  methods: {
    changeShowDeleteBtn (value) {
      this.showDeleteBtn = value
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .Home
    width: 100%
    padding-top: .95rem
  @media (min-width: 700px)
    .Home
      width: 700px
</style>
