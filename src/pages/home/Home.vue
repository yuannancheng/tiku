<template>
  <div class="Home">
    <home-header></home-header>
    <home-list></home-list>
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
