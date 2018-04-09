<template>
  <div>
    <!-- ORIGINAL TITLE -->
    <div class="content" v-if="translated"><span class="label">{{ $t('item.originalTitle')}}:&nbsp;</span>{{ originalTitle }} ({{ details.original_language }})</div>
    <!-- RELEASE -->
    <div class="content" v-if="mediaType === 'movie'"><span class="label">{{ $t('item.release')}}:&nbsp;</span>{{ releaseDate }}</div>
    <div class="content" v-if="mediaType === 'tv'"><span class="label">{{ $t('item.firstAirDate')}}:&nbsp;</span>{{ releaseDate }}</div>
    <!-- STATUS -->
    <!--<div class="content"><span class="label">{{ $t('item.status')}}:&nbsp;</span>{{ details.status }}</div>-->
    <!-- NETWORK -->
    <div class="content" v-if="mediaType === 'tv'">
      <span class="label">{{ $t('item.networks')}}:&nbsp;</span>
      <span v-for="(network, index) in details.networks" :key="network.id">
        <span>{{network.name}}</span><span v-if="index + 1 < details.networks.length">,&nbsp;</span>
      </span>
    </div>
    <!-- RUNTIME -->
    <div class="content" v-if="mediaType === 'movie'"><span class="label">{{ $t('item.runtime')}}:&nbsp;</span>{{ details.runtime }} min</div>
    <!-- GENRES -->
    <div class="content">
      <span class="label">{{ $t('item.genres')}}:&nbsp;</span>
      <span v-for="(genre, index) in details.genres" :key="genre.id">
        <span>{{genre.name}}</span><span v-if="index + 1 < details.genres.length">,&nbsp;</span>
      </span>
    </div>
    <!-- RATING -->
    <div class="content" v-if="details.vote_count >= 10"><span class="label">{{ $t('item.rating')}}:&nbsp;</span>{{ details.vote_average }}</div>
    <!-- DIRECTOR -->
    <div class="content" v-if="mediaType === 'movie' && director">
      <span class="label">{{ $t('item.director') }}:&nbsp;</span>
      <a v-bind:href="'https://www.themoviedb.org/person/' + director.id" target="_blank">{{ director.name }}</a>
    </div>
    <!-- CREATED BY -->
    <div class="content" v-if="mediaType === 'tv'"><span class="label">{{ $t('item.createdby')}}:&nbsp;</span>{{ releaseDate }}</div>
    <!-- LINKS -->
    <div class="content" v-if="links.length > 0">
      <span class="label">{{ $t('item.links')}}:&nbsp;</span>
      <span v-for="(link, index) in links" :key="link.name">
        <a v-bind:href="link.url" target="_blank">{{ link.name }}</a><span v-if="index + 1 < links.length">,&nbsp;</span>
      </span>
    </div>
    <!-- PRODUCTION -->
    <!--
    <div class="content">
      <span class="label">{{ $t('item.productionCompanies')}}:&nbsp;</span>
      <span v-for="(company, index) in details.production_companies" :key="company.id">
        <span>{{company.name}}</span><span v-if="index + 1 < details.production_companies.length">,&nbsp;</span>
      </span>
    </div>
    -->
  </div>
</template>

<script>
export default {
  name: 'ItemInformation',
  props: ['item', 'details', 'crew', 'mediaType'],
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
      let originalLanguage = this.$store.getters.locale.startsWith(this.details.original_language)
      return !originalLanguage && this.originalTitle !== this.title
    },
    director () {
      if (!this.crew) {
        return false
      }
      let director = null
      this.crew.forEach(c => {
        if (c.job === 'Director') {
          director = c
        }
      })
      return director
    },
    movieDbUrl () {
      return 'https://www.themoviedb.org/' + this.mediaType + '/' + this.details.id
    },
    homepage () {
      return this.details.homepage
    },
    isAvailableOnNetflix () {
      return this.details.homepage.includes('www.netflix.com/')
    },
    links () {
      let links = []
      if (this.isAvailableOnNetflix) {
        let netflixLink = { name: this.$t('item.netflix'), url: this.homepage }
        links.push(netflixLink)
      } else if (this.details.homepage) {
        let homepage = { name: this.$t('item.homepage'), url: this.homepage }
        links.push(homepage)
      }
      let movieDbLink = { name: this.$t('item.movieDb'), url: this.movieDbUrl }
      links.push(movieDbLink)
      return links
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          overview: 'Handlung',
          info: 'Details',
          cast: 'Besetzung',
          genres: 'Genres',
          originalTitle: 'Originaltitel',
          release: 'Premiere',
          firstAirDate: 'Erstausstrahlung',
          rating: 'MovieDb Bewertung',
          productionCompanies: 'Produkion',
          networks: 'Netzwerk',
          createdby: 'Created by',
          director: 'Regisseur',
          runtime: 'Laufzeit',
          links: 'Links',
          netflix: 'Netflix',
          homepage: 'Homepage',
          movieDb: 'The Movie DB'
        }
      },
      en: {
        item: {
          overview: 'Overview',
          info: 'Details',
          cast: 'Cast',
          genres: 'Genres',
          release: 'Release',
          originalTitle: 'Original title',
          firstAirDate: 'Premiered',
          rating: 'MovieDb Rating',
          productionCompanies: 'Production',
          networks: 'Networks',
          createdby: 'Created by',
          director: 'Director',
          runtime: 'Runtime',
          links: 'Links',
          netflix: 'Netflix',
          homepage: 'Homepage',
          movieDb: 'The Movie DB'
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
.label {
  font-weight: bold;
  /* text-transform: uppercase; */
}
a {
  color: #ffbf58;
}
a:hover {
  color: #ffbf58;
}
</style>
