<template>
  <div class="header" v-bind:style="{ backgroundImage: 'url(' + backdrop + ')', height: calculatedHeight + 'px' }" v-bind:class=" { 'shrinked' : shrinked, 'expanded' : !shrinked }">
    <div class="title" v-bind:style="calculatedStyle">
        {{ title }}
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemHeader',
  props: ['title', 'backdrop', 'backdropPlaceholder', 'shrink'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      minHeight: 50,
      maxHeight: 180,
      minPosition: 0,
      maxPosition: 160,
      titleThreshold: 0,
      backgroundThreshold: 80
    }
  },
  components: {
  },
  computed: {
    calculatedHeight () {
      let height = this.maxHeight - this.minHeight
      height = height / 100 * (100 - this.shrink)
      height = height + this.minHeight
      return height
    },
    calculatedTitlePosition () {
      if (this.shrink > this.titleThreshold) {
        return this.minPosition
      } else {
        return this.maxPosition
      }
    },
    calculatedStyle () {
      let left = this.calculatedTitlePosition + 'px'
      if (this.shrink > (this.titleThreshold + 20)) {
        return {
          'white-space': 'nowrap',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          left: left
        }
      }
      return {
        left: left
      }
    },
    shrinked () {
      return this.shrink >= this.backgroundThreshold
    }
  },
  methods: {

  },
  i18n: {
    messages: {
      de: {
        item: {
          downloaded: 'Erfolgreich heruntergeladen'
        }
      },
      en: {
        item: {
          downloaded: 'Successfully downloaded'
        }
      }
    }
  }
}
</script>

<style scoped>
.header {
    position: fixed;
    width: 100%;
    background-size: cover;
    background-position: center;
    padding: 30px 0 0 0;
    z-index: 100;
}
.header.shrinked:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
}
.header.expanded:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to bottom,rgba(0,0,0,0), rgba(0, 0, 0, 0.8));
}
.title {
  position: absolute;
  bottom: 0px;
  padding: 0 0 0 15px;
  z-index: 201;
  text-shadow: black 1px 0 10px;
  padding-right: 55px;
  -webkit-transition: all .5s ease-in-out;
  -moz-transition: all .5s ease-in-out;
  -o-transition: all .5s ease-in-out;
  -ms-transition: all .5s ease-in-out;
  transition: all .5s ease-in-out;
}
@media screen and (min-width: 767.99px) {
  .title {
    font-size: 28px;
  }
}
@media screen and (max-width: 767.99px) {
  .title {
    font-size: 20px;
  }
}
@media screen and (max-width: 575.99px) {
  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
