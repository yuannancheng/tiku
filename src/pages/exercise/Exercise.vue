<template>
  <div>
    <exercise-header :TestDataIndex="TestDataIndex"></exercise-header>
    <exercise-body :TestDataIndex="TestDataIndex"></exercise-body>
  </div>
</template>

<script>
import ExerciseHeader from './components/Header'
import ExerciseBody from './components/Body'
export default {
  name: 'Exercise',
  components: {
    ExerciseHeader,
    ExerciseBody
  },
  data () {
    return {
      TestDataIndex: this.$route.params.id
    }
  }
}
</script>

<style>
</style>
