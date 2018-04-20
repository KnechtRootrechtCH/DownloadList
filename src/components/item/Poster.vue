<template>
  <div class="poster" v-bind:style=" { left: calculatedPosition + 'px', opacity: calculatedOpacity } ">
    <progressive-img class="image" v-bind:src="poster" v-bind:fallback="placeholder" :blur="10"></progressive-img>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'Poster',
  props: ['poster', 'placeholder', 'shrink'],
  mixins: [UtilsMixin],
  data () {
    return {
      minPosition: -300,
      maxPosition: 15,
      threshold: 0
    }
  },
  components: {
  },
  computed: {
    calculatedPosition () {
      let position = this.maxPosition - this.minPosition
      position = position / 100 * (100 - this.shrink)
      position = position + this.minPosition
      return position
    },
    calculatedOpacity () {
      if (this.shrink > this.threshold) {
        return 0
      } else {
        return 1
      }
    }
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
        }
      },
      en: {
        item: {
        }
      }
    }
  }
}
</script>

<style scoped>
.poster {
  position: fixed;
  left: 15px;
  top: 80px;
  z-index: 300;
  -webkit-transition: all .5s ease-in-out;
  -moz-transition: all .5s ease-in-out;
  -o-transition: all .5s ease-in-out;
  -ms-transition: all .5s ease-in-out;
  transition: all .5s ease-in-out;
}
.poster .image {
  width: 150px;
  margin: 0 15px 15px 0;
  border-color: #d0d0d0;
  border-style: solid;
}
</style>
