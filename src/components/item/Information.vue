<template>
  <div>
    <!-- DOWNLOADED -->
    <div class="content" v-if="isSelected">
      <span class="label">{{ $t('item.downloaded')}}:&nbsp;</span>
      <font-awesome-icon
          :icon="downloadedIcon"
          class="icon"
          @click="$emit('toggleDownloaded')"
          v-bind:class="{ 'downloaded' : isDownloaded }"/>
      <span v-if="isTv(item)">{{ totalDownloadedCount }}&nbsp;/&nbsp;{{ totalEpisodeCount }}</span>
      <span v-if="isMovie(item)">{{ $t('item.' + item.downloaded) }}</span>
    </div>
    <div class="content" v-if="isSelected && isMovie(item)"></div>
    <!-- PRIORITY -->
    <div class="content" v-if="item && item.priority && item.priority > 0"><span class="label">{{ $t('item.priority')}}:&nbsp;</span>
    <font-awesome-icon
      v-for="p in priorities"
      :key="p"
      :icon="icon('star')"
      class="priority-icon"
      v-bind:class="[{ 'highlighted' : hasPriority(p) }, icon]"
      @click.stop="setItemPriority(p)" @mouseover="hoverPriority = p" @mouseout="hoverPriority = settings.priority.min + 1"/>
    </div>
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
    <div class="content" v-if="details.vote_count >= 10">
        <span class="label">{{ $t('item.rating')}}:&nbsp;</span>
        <span>{{ details.vote_average }}</span>
    </div>
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
    <!-- DOWNLOAD LINKS -->
    <div class="content" v-if="downloadLinks.length > 0">
      <span class="label">{{ $t('item.downloadLinks')}}:&nbsp;</span>
      <span v-for="(link, index) in downloadLinks" :key="link.name">
        <a v-bind:href="link.url" target="_blank">{{ link.name }}</a><span v-if="index + 1 < downloadLinks.length">,&nbsp;</span>
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
import UtilsMixin from '../../mixins/utils'
import MetadataMixin from '../../mixins/metadata'
import TransactionsMixin from '../../mixins/transactions'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemInformation',
  props: ['item', 'details', 'crew', 'mediaType', 'totalEpisodeCount', 'totalDownloadedCount'],
  mixins: [UtilsMixin, MetadataMixin, TransactionsMixin, IconsMixin],
  data () {
    return {
      hoverPriority: 10
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
    isSelected () {
      return this.item && this.item.priority > 0
    },
    isDownloaded () {
      return (this.isTv(this.item) && this.totalDownloadedCount === this.totalEpisodeCount) ||
        (!this.isTv(this.item) && this.item.downloaded)
    },
    downloadedIcon () {
      if (this.isDownloaded) {
        return this.icon('check')
      }
      return this.icon('clock')
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
    },
    downloadLinks () {
      let links = []
      if (this.isMovie(this.details)) {
        let hdArena = { name: 'HD Arena', url: this.getHdArenaSearchUrl(this.details) }
        links.push(hdArena)
        let movieBlog = { name: 'Movie Blog', url: this.getMovieBlogSearchUrl(this.details) }
        links.push(movieBlog)
      }
      return links
    }
  },
  methods: {
    hasPriority (priority) {
      return this.item.priority <= priority || this.hoverPriority <= priority
    },
    setItemPriority (p) {
      this.setPriority(this.item.key, p)
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
          rating: 'Bewertung',
          productionCompanies: 'Produkion',
          networks: 'Netzwerk',
          createdby: 'Created by',
          director: 'Regisseur',
          runtime: 'Laufzeit',
          links: 'Links',
          downloadLinks: 'Download Suche',
          netflix: 'Netflix',
          netflixSearch: 'Netflix Suche',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Priorität',
          priority1: 'hoch',
          priority2: 'mittel',
          priority3: 'tief',
          downloaded: 'Heruntergeladen',
          true: 'Ja',
          false: 'Nein',
          undefined: 'Nein'
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
          rating: 'Rating',
          productionCompanies: 'Production',
          networks: 'Networks',
          createdby: 'Created by',
          director: 'Director',
          runtime: 'Runtime',
          links: 'Links',
          downloadLinks: 'Download search',
          netflix: 'Netflix',
          netflixSearch: 'Netflix search',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Priority',
          priority1: 'high',
          priority2: 'medium',
          priority3: 'low',
          downloaded: 'Downloaded',
          true: 'Yes',
          false: 'No',
          undefined: 'No'
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
.priority-icon {
  opacity: 0.5;
  cursor: pointer;
}
.priority-icon.highlighted {
  opacity: 1;
}
.icon {
  cursor: pointer;
}
.icon.downloaded {
  opacity: 1;
  color: limegreen;
}
</style>
