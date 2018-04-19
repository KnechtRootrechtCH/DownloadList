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
    <!-- PRIORITY -->
    <!-- TODO: visual priority display (stars)-->
    <div class="content" v-if="item && item.priority && item.priority > 0"><span class="label">{{ $t('item.priority')}}:&nbsp;</span>{{ $t('item.priority' + item.priority) }}</div>
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
import UtilsMixin from '../../mixins/utils'

export default {
  name: 'ItemInformation',
  props: ['item', 'details', 'crew', 'mediaType'],
  mixins: [UtilsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    title () {
      return this.getTitle(this.details)
    },
    originalTitle () {
      return this.getOriginalTitle(this.details)
    },
    releaseDate () {
      return this.getReleaseDateFormated(this.details, 'DD.MM.YYYY')
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
        if (c.job.toLowerCase() === this.constants.JOB.DIRECTOR) {
          director = c
        }
      })
      return director
    },
    homepage () {
      return this.details.homepage
    },
    links () {
      let links = []
      let movieDbLink = { name: this.$t('item.movieDb'), url: this.getMovieDbUrl(this.details) }
      links.push(movieDbLink)

      if (this.isAvailableOnNetflix(this.details)) {
        let netflixLink = { name: this.$t('item.netflix'), url: this.getNetflixUrl(this.details) }
        links.push(netflixLink)
      } else if (this.details.homepage) {
        let homepage = { name: this.$t('item.homepage'), url: this.homepage }
        links.push(homepage)
        let netflixSearch = { name: this.$t('item.netflixSearch'), url: 'https://www.netflix.com/search?q=' + this.title }
        links.push(netflixSearch)
      }

      return links
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
          netflixSearch: 'Netflix Suche',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Download Priorität',
          priority1: 'hoch',
          priority2: 'mittel',
          priority3: 'tief'
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
          netflixSearch: 'Netflix search',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Download priority',
          priority1: 'high',
          priority2: 'medium',
          priority3: 'low'
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
