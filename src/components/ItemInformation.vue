<template>
  <div>
    <div class="content">
      <p class="tagline" v-if="details.tagline">{{ details.tagline}}</p>
      <p>{{ details.overview}}</p>
    </div>
    <div class="content" v-if="mediaType === 'movie'"><span class="label">{{ $t('item.release')}}:&nbsp;</span>{{ releaseDate }}</div>
    <div class="content" v-if="mediaType === 'tv'"><span class="label">{{ $t('item.firstAirDate')}}:&nbsp;</span>{{ releaseDate }}</div>
    <div class="content">
      <span class="label">{{ $t('item.genres')}}:&nbsp;</span>
      <span v-for="(genre, index) in details.genres" :key="genre.id">
        <span>{{genre.name}}</span><span v-if="index + 1 < details.genres.length">,&nbsp;</span>
      </span>
    </div>
    <div class="content" v-if="translated"><span class="label">{{ $t('item.originalTitle')}}:&nbsp;</span>{{ originalTitle }} ({{ details.original_language }})</div>
    <div class="content">vote_average {{ details.vote_average }}</div>
    <div class="content">TV: Network, created by, seasons, episodes, status</div>
    <div class="content">Movie: production companies, runtime, status</div>
    <div class="content">In Links: recognize netflix links and show them differently!,  IMDB ID link?,</div>
    <div class="content">In header: ok mark when downloaded</div>
  </div>
</template>

<script>
export default {
  name: 'ItemInformation',
  props: ['item', 'details', 'mediaType'],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    title () {
      if (this.mediaType === 'movie') {
        return this.details.title
      } else if (this.mediaType === 'tv') {
        return this.details.name
      }
    },
    originalTitle () {
      if (this.mediaType === 'movie') {
        return this.details.original_title
      } else if (this.mediaType === 'tv') {
        return this.details.original_name
      }
    },
    release () {
      let date = null
      if (this.mediaType === 'movie') {
        date = this.details.release_date
      } else if (this.mediaType === 'tv') {
        date = this.details.first_air_date
      }
      if (date) {
        return this.$moment(date)
      }
      return null
    },
    releaseDate () {
      let date = this.release
      if (date) {
        return date.format('DD.MM.YYYY')
      } else {
        return '?'
      }
    },
    rating () {
      return this.details.vote_average
    },
    translated () {
      return !this.$store.getters.locale.startsWith(this.details.original_language)
    }
  },
  methods: {
  },
  i18n: {
    messages: {
      de: {
        item: {
          overview: 'Handlung',
          info: 'Details',
          cast: 'Besetzung',
          originalTitle: 'Originaltitel'
        }
      },
      en: {
        item: {
          overview: 'Overview',
          info: 'Details',
          cast: 'Cast',
          originalTitle: 'Original title'
        }
      }
    }
  }
}
</script>

<style scoped>
.content {
  margin-bottom: 10px;
}
.tagline {
  font-weight: bold;
  font-style: italic;
}
.label {
  font-weight: bold;
}
hr {
  width: 100%;
  height: 0.01em;
  background: #d0d0d0;
}
</style>
