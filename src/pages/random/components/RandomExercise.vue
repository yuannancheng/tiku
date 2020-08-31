<template>
  <div class="random-exercise">
    <random-exercise-header
      :TestDataIndex="TestDataIndex"
      @close="closeExercise"
    ></random-exercise-header>
    <random-exercise-body
      ref="RandomExerciseBody"
      :TestDataIndex="TestDataIndex"
      :showWriteNoteBtn="showWriteNoteBtn"
      @prev="prev"
      @next="next"
      @changeShowPanel="changeShowPanel"
      @changeShowEdit="changeShowEdit"
    ></random-exercise-body>
    <random-exercise-under
      :TestDataIndex="TestDataIndex"
      @prev="prev"
      @next="next"
      @changeShowPanel="changeShowPanel"
    ></random-exercise-under>
    <transition name="Panel">
      <random-exercise-panel
        v-show="showPanel"
        ref="RandomExercisePanel"
        :TestDataIndex="TestDataIndex"
        @changeShowPanel="changeShowPanel"
        @jumpTest="jumpTest"
      ></random-exercise-panel>
    </transition>
    <random-write-note-btn
      :showWriteNoteBtn="showWriteNoteBtn"
      @changeShowEdit="changeShowEdit"
    ></random-write-note-btn>
    <random-note-edit
      v-show="showEdit"
      ref="Edit"
      :TestDataIndex="TestDataIndex"
      @changeShowEdit="changeShowEdit"
    ></random-note-edit>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import RandomExerciseHeader from './random-exercise/Header'
import RandomExerciseBody from './random-exercise/Body'
import RandomExerciseUnder from './random-exercise/Under'
import RandomExercisePanel from './random-exercise/Panel'
import RandomWriteNoteBtn from './random-exercise/WriterNoteBtn'
import RandomNoteEdit from './random-exercise/Edit'
export default {
  name: 'RandomExercise',
  props: {
    TestDataIndex: Number,
    showExercise: Boolean
  },
  components: {
    RandomExerciseHeader,
    RandomExerciseBody,
    RandomExerciseUnder,
    RandomExercisePanel,
    RandomWriteNoteBtn,
    RandomNoteEdit
  },
  data () {
    return {
      showPanel: false,
      showEdit: false
    }
  },
  watch: {
    showExercise () {
      if (this.showExercise === true) {
        this.$nextTick(() => {
          this.$refs.RandomExerciseBody._activated()
        })
      } else if (this.showExercise === false) {
        this.$nextTick(() => {
          this.$refs.RandomExerciseBody._deactivated()
        })
      }
    }
  },
  computed: {
    ...mapState(['UserData']),
    lastIndex () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return this.UserData.Random[this.TestDataIndex].lastIndex
    },
    showWriteNoteBtn () {
      if (
        'Random' in this.UserData &&
        this.TestDataIndex in this.UserData.Random
      ) return 'Random' in this.UserData && this.lastIndex in this.UserData.Random[this.TestDataIndex].data.record
    }
  },
  methods: {
    ...mapMutations(['setRandomDataLastIndex']),
    closeExercise () {
      this.$emit('changeShowExercise', false)
    },
    prev () {
      this.$refs.RandomExerciseBody.swiper.slidePrev()
    },
    next () {
      this.$refs.RandomExerciseBody.swiper.slideNext()
    },
    jumpTest (id) {
      id = id - 1
      this.setRandomDataLastIndex([this.TestDataIndex, id])
      this.$refs.RandomExerciseBody._activated()
      if (this.showPanel === true) {
        this.showPanel = false
        this.$nextTick(() => {
          this.$refs.RandomExercisePanel._deactivated()
        })
      }
    },
    changeShowPanel (value) {
      this.showPanel = value
      if (value === true) {
        this.$refs.RandomExerciseBody._deactivated()
        this.$nextTick(() => {
          this.$refs.RandomExercisePanel._activated()
        })
      } else if (value === false) {
        this.$refs.RandomExerciseBody._activated()
        this.$nextTick(() => {
          this.$refs.RandomExercisePanel._deactivated()
        })
      }
    },
    changeShowWriteNoteBtn (value) {
      this.showWriteNoteBtn = value
    },
    changeShowEdit (value) {
      this.showEdit = value
      if (value === true) {
        this.$refs.RandomExerciseBody._deactivated()
        this.$nextTick(() => {
          this.$refs.Edit._activated()
        })
      } else if (value === false) {
        this.$refs.RandomExerciseBody._activated()
        this.$nextTick(() => {
          this.$refs.Edit._deactivated()
        })
      }
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .random-exercise
    position: fixed
    top: 0
    width: inherit
    padding-top: .95rem
    min-height: 100vh
    box-sizing: border-box
</style>
