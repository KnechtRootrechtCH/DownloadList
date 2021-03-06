<template>
  <div>
    <!-- DOWNLOADED -->
    <div class="content" v-if="isSelected">
      <span class="label">{{ $t('item.status')}}:&nbsp;</span>
      <span v-if="isDownloaded">{{ $t('item.downloaded')}}</span>
      <span v-if="!isDownloaded && isUnreleased">{{ $t('item.unreleased')}}</span>
      <span v-if="!isDownloaded && !isUnreleased && item.downloadStatus">{{ $t('item.' + item.downloadStatus)}}</span>
      <span v-if="!isDownloaded && !isUnreleased && !item.downloadStatus">{{ $t('item.todo')}}</span>
      <span v-if="isTv(item)">({{ totalDownloadedCount }}&nbsp;/&nbsp;{{ totalEpisodeCount }})</span>
      <font-awesome-icon
        :icon="statusIcon"
        v-bind:class="{ 'green': isDownloaded, 'skyblue' : isQueued, 'orange': isUnreleased, 'yellow': isNotYetAvailable || isHardToFind }"
        />
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
    <!-- STATUS -->
    <!--<div class="content"><span class="label">{{ $t('item.status')}}:&nbsp;</span>{{ details.status }}</div>-->
    <!-- NETWORK -->
    <div class="content" v-if="mediaType === 'tv'">
      <span class="label">{{ $t('item.networks')}}:&nbsp;</span>
      <span v-for="(network, index) in details.networks" :key="network.id">
        <span>{{ network.name }}</span><span v-if="index + 1 < details.networks.length">,&nbsp;</span>
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
    <!-- RELEASES -->
    <div class="content" v-if="mediaType === 'tv'"><span class="label">{{ $t('item.firstAirDate')}}:&nbsp;</span>{{ releaseDate }}</div>
    <div class="content" v-if="mediaType === 'movie'" v-for="(r, index) in releaseDates('US')" :key="index">
      <span class="label">US&nbsp;{{ $t('item.releaseType' + r.type)}}:&nbsp;</span>{{ formatReleaseDate(r.release_date) }}<span class="italic" v-if="r.note">&nbsp;-&nbsp;{{ r.note }}</span>
    </div>
    <div class="content" v-if="mediaType === 'movie'" v-for="(r, index) in releaseDates('CH')" :key="index">
      <span class="label">CH&nbsp;{{ $t('item.releaseType' + r.type)}}:&nbsp;</span>{{ formatReleaseDate(r.release_date) }}<span class="italic" v-if="r.note">&nbsp;-&nbsp;{{ r.note }}</span>
    </div>
    <div class="content" v-if="mediaType === 'movie' && !releaseDates('CH') && !releaseDates('US')"><span class="label">{{ $t('item.release')}}:&nbsp;</span>{{ releaseDate }}</div>
    <!-- LINKS -->
    <div class="content" v-if="links.length > 0">
      <span class="label">{{ $t('item.infoLinks')}}:&nbsp;</span>
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
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import MetadataMixin from '../../mixins/metadata'
import TransactionsMixin from '../../mixins/transactions'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemInformation',
  props: ['item', 'details', 'crew', 'mediaType', 'totalEpisodeCount', 'totalDownloadedCount', 'isQueued', 'isHardToFind', 'isUnreleased', 'isNotYetAvailable'],
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
    statusIcon () {
      return this.icon(this.itemStatusIconName(this.item))
    },
    links () {
      let links = []
      // Homepage
      if (this.homepage) {
        let homepage = { name: this.$t('item.homepage'), url: this.homepage }
        links.push(homepage)
      }
      // Movie DB
      let movieDbLink = { name: this.$t('item.movieDb'), url: this.getMovieDbUrl(this.details) }
      links.push(movieDbLink)
      // Trakt.tv
      let query = this.getSearchString(this.details)
      let traktSearchUrl = 'https://trakt.tv/search?query=' + query
      let trakt = { name: this.$t('item.traktSearch'), url: traktSearchUrl }
      links.push(trakt)
      // Netflix
      if (this.isAvailableOnNetflix(this.details)) {
        let netflixLink = { name: this.$t('item.netflix'), url: this.getNetflixUrl(this.details) }
        links.push(netflixLink)
      } else if (this.details.homepage) {
        let netflixSearch = { name: this.$t('item.netflixSearch'), url: 'https://www.netflix.com/search?q=' + this.title }
        links.push(netflixSearch)
      }
      return links
    },
    downloadLinks () {
      let links = []
      for (let key in this.settings.downloadLinks) {
        let value = this.settings.downloadLinks[key]
        if ((value.tv && this.isTv(this.details)) || (value.movie && this.isMovie(this.details))) {
          if (!value.languages || value.languages.indexOf(this.details.original_language) !== -1 || value.languages.indexOf(this.$store.getters.locale) !== -1) {
            let url = value.urlPattern.replace('{query}', this.getSearchString(this.details))
            let link = { name: value.title, url: url }
            links.push(link)
          }
        }
      }
      return links
    },
    releases () {
      let releases = {}
      if (this.mediaType !== 'movie' || !this.details.release_dates) {
        return null
      }
      this.details.release_dates.results.forEach(r => {
        releases[r.iso_3166_1] = r
      })
      return releases
    }
  },
  methods: {
    hasPriority (priority) {
      return this.item.priority <= priority || this.hoverPriority <= priority
    },
    setItemPriority (p) {
      this.setPriority(this.item.key, p)
    },
    formatReleaseDate (date) {
      let moment = this.$moment(date)
      if (moment) {
        let formated = moment.format('DD.MM.YYYY')
        return formated
      }
      return moment
    },
    releaseDates (country, fallback) {
      let releases = this.releases
      if (!releases) {
        return null
      }
      let result = null
      result = releases[country]
      if (!result && fallback) {
        result = releases[fallback]
      }
      if (result) {
        return result.release_dates
      }
      return null
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
          infoLinks: 'Links',
          downloadLinks: 'Downloads',
          netflix: 'Netflix',
          netflixSearch: 'Netflix Suche',
          traktSearch: 'Trakt.tv',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Priorität',
          status: 'Status',
          downloaded: 'Heruntergeladen',
          queued: 'Wird heruntergeladen',
          todo: 'ToDo',
          unreleased: 'Unveröffentlicht',
          notYetAvailable: 'Noch nicht erhältlich',
          hardToFind: 'Noch nicht gefunden',
          true: 'Ja',
          false: 'Nein',
          undefined: 'Todo',
          releaseType1: 'Premiere',
          releaseType2: 'Limitierter Kinostart',
          releaseType3: 'Kinostart',
          releaseType4: 'Digitale Veröffentlichung',
          releaseType5: 'DVD/Blu-ray',
          releaseType6: 'TV'
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
          infoLinks: 'Links',
          downloadLinks: 'Downloads',
          netflix: 'Netflix',
          netflixSearch: 'Netflix Suche',
          traktSearch: 'Trakt.tv',
          homepage: 'Homepage',
          movieDb: 'The Movie DB',
          priority: 'Priority',
          status: 'Status',
          downloaded: 'Downloaded',
          queued: 'Queued',
          todo: 'Todo',
          unreleased: 'Unreleased',
          notYetAvailable: 'Not available yet',
          hardToFind: 'Not found yet',
          true: 'Yes',
          false: 'No',
          undefined: 'Todo',
          releaseType1: 'Premiere',
          releaseType2: 'Limited Theatrical Release',
          releaseType3: 'Theatrical Release',
          releaseType4: 'Digital Release',
          releaseType5: 'Physical Release',
          releaseType6: 'TV'
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
.italic {
  font-style: italic;
}
</style>
