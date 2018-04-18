<template>
  <div class="header" v-bind:style="{ backgroundImage: 'url(' + backdrop + ')', height: shrinkedHeight + 'px' }" v-bind:class=" { 'shrinked' : shrinked, 'expanded' : !shrinked }">
    <!--
    <div class="poster-section">
      <progressive-img class="poster-small d-md-none" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
      <progressive-img class="poster-big d-none d-md-block" v-bind:src="poster" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
    </div>-->
    <div class="title">
        {{ title }}

    </div>

    <!--
    <div class="actions">
      <font-awesome-icon
        v-if="isDownloaded"
        :icon="icon('check')"
        class="icon"
        v-bind:title="$t('item.downloaded')"/>
      <font-awesome-icon
        v-if="!isDownloaded && isSelected"
        :icon="icon('edit')"
        class="icon"
        v-bind:title="$t('item.downloaded')"/>
      <font-awesome-icon
        v-if="!isSelected"
        :icon="icon('plus')"
        class="icon"
        v-bind:title="$t('item.downloaded')"/>
    </div>-->
    <!--
    <div class="title-section small d-md-none">
        <span class="title">{{ title }}&nbsp;</span>
        <span class="actions">
          <font-awesome-icon
            v-if="isDownloaded"
            :icon="icon('check')"
            class="icon"
            v-bind:title="$t('item.downloaded')"/>
          <font-awesome-icon
            v-if="!isDownloaded && isSelected"
            :icon="icon('edit')"
            class="icon"
            v-bind:title="$t('item.downloaded')"/>
          <font-awesome-icon
            v-if="!isSelected"
            :icon="icon('plus')"
            class="icon"
            v-bind:title="$t('item.downloaded')"/>
        </span>
    </div>-->
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
      maxHeight: 150,
      threshold: 80
    }
  },
  components: {
  },
  computed: {
    shrinkedHeight () {
      let height = this.maxHeight - this.minHeight
      height = height / 100 * (100 - this.shrink)
      height = height + this.minHeight
      return height
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
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    -ms-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
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
  background-image: linear-gradient(to bottom,rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media screen and (min-width: 768px) {
  .title {
    font-size: 28px;
  }
}
@media screen and (max-width: 768px) {
  .title {
    font-size: 20px;
  }
}
/*
.poster-section {
  float: right;
}
.title.small {
  margin-top: 150px;
  font-weight: bold;
  font-size: 18px;
}
.title-section .icon {
  width: 50px;
  height: 50px;
  float: right;
  color: skyblue;
}

.poster-small {
  width: 130px;
  margin: 20px 15px 0 15px;
  border-color: #d0d0d0;
  border-style: solid;
}
.poster-big {
  width: 160px;
  margin: 0 15px 0 15px;
  border-color: #d0d0d0;
  border-style: solid;
}

.header::after {
  display: block;
  position: relative;
  background-image: linear-gradient(to bottom, transparent 0%, white 100%);
  margin-top: -150px;
  height: 150px;
  width: 100%;
  content: '';
}*/
</style>
