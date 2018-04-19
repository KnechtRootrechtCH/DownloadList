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
  props: ['item', 'details', 'shrink'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      minHeight: 50,
      maxHeight: 180,
      minPosition: 0,
      maxPosition: 150,
      threshold: 50
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
      if (this.shrink > this.threshold) {
        return this.minPosition
      } else {
        return this.maxPosition
      }
    },
    calculatedStyle () {
      let left = this.calculatedTitlePosition + 'px'
      if (this.shrink > (this.threshold + 20)) {
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
      return this.shrink >= this.threshold
    },
    title () {
      return this.getTitle(this.details)
    },
    originalTitle () {
      return this.getOriginalTitle(this.details)
    },
    releaseYear () {
      return this.getReleaseDateFormated(this.details, 'YYYY')
    },
    poster () {
      return this.getPosterImage(this.details, this.constants.IMAGESIZE.POSTER.W185)
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    },
    backdrop () {
      return this.getBackdropImage(this.details, this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    backdropPlaceholder () {
      return this.getBackdropPlaceholder(this.constants.IMAGESIZE.BACKDROP.W1400)
    },
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      if (this.item) {
        return this.item.downloaded
      }
      return false
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
  /*background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.6), rgba(254, 190, 86, 0.9));*/
  background-image: linear-gradient(to bottom,rgba(0, 0, 100, 0.7), rgba(0, 0, 100, 0.9));
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
