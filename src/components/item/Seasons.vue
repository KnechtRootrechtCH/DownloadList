<template>
  <div>
    <div class="content">
      <h5 class="label">{{ $t('item.seasons')}}</h5>
      <swiper :options="swiperOptions" ref="mySwiper">
        <swiper-slide v-for="(season) in seasons" :key="season.id">
          <div class="card border-dark media-card bg-dark text-faded">
              <div class="card-body">
                <div class="info">
                  <router-link :to="details.id + '/season/' + season.season_number">{{ season.name }}</router-link>
                  <span class="download-count pull-right" v-if="isSelected">
                    {{ downloaded(season) }}/{{ episodes(season) }}
                    <span class="actions">
                      <font-awesome-icon
                        v-if="isDownloaded(season)"
                        @click="setDownloaded(season, false)"
                        :icon="icon('check')"
                        class="icon downloaded fa-hover-hidden"/>
                      <font-awesome-icon
                        v-if="isDownloaded(season)"
                        @click="setDownloaded(season, false)"
                        :icon="icon('redo')"
                        class="icon fa-hover-show"/>
                      <font-awesome-icon
                        v-if="!isDownloaded(season)"
                        @click="setDownloaded(season, true)"
                        :icon="icon('exclamation')"
                        class="icon fa-hover-hidden"/>
                      <font-awesome-icon
                        v-if="!isDownloaded(season)"
                        @click="setDownloaded(season, true)"
                        :icon="icon('check')"
                        class="icon fa-hover-show"/>
                    </span>
                  </span></div>
                  <div class="info">{{ year(season) }}</div>
              </div>
              <div class="card-img-bottom" @click="clicked(season)">
                <progressive-img class="photo" v-bind:src="poster(season)" v-bind:fallback="posterPlaceholder" :blur="10"></progressive-img>
              </div>
            </div>
        </swiper-slide>
        <!--<div class="swiper-pagination"  slot="pagination"></div>-->
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
        <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
      </swiper>
    </div>
  </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemSeasons',
  props: ['item', 'details', 'includeSpecials'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      swiperOptions: {
        slidesPerView: 8,
        spaceBetween: 5,
        effect: 'slide',
        mousewheel: false,
        watchOverflow: true,
        breakpoints: {
          400: {
            slidesPerView: 2
          },
          576: {
            slidesPerView: 3
          },
          768: {
            slidesPerView: 4
          },
          992: {
            slidesPerView: 5
          },
          1200: {
            slidesPerView: 6
          },
          1400: {
            slidesPerView: 8
          }
        },
        /*
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true
        },
        */
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  components: {
  },
  computed: {
    seasons () {
      let seasons = this.details.seasons.filter((s) => s.season_number !== 0)
      let specials = this.details.seasons.filter((s) => s.season_number === 0)
      if (this.includeSpecials && specials && specials.length > 0) {
        return seasons.concat(specials)
      }
      return seasons
    },
    posterPlaceholder () {
      return this.getPosterPlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    },
    isSelected () {
      return this.item && this.item.priority > 0
    }
  },
  methods: {
    poster (season) {
      return this.getPosterImage(season, this.constants.IMAGESIZE.POSTER.W185)
    },
    year (season) {
      return this.getReleaseDateFormated(season, 'YYYY')
    },
    clicked (season) {
      this.routeTo(this.details.id + '/season/' + season.season_number)
    },
    episodes (season) {
      if (season.episode_count) {
        return season.episode_count
      } else if (season.episodes) {
        return season.episodes.length
      }
    },
    downloaded (season) {
      let count = this.getEpisodeDownloadCount(this.item, season.season_number)
      if (!count) {
        return 0
      }
      return count
    },
    isDownloaded (season) {
      if (this.isSelected) {
        return this.downloaded(season) === this.episodes(season)
      }
      return false
    },
    setDownloaded (season, downloaded) {
      let state = null
      for (let i = 1; i <= this.episodes(season); i++) {
        state = this.getEpisodeDownloadState(this.item, season.season_number, i)
        if (state !== downloaded) {
          this.updateEpisodeDownloadState(this.item.id, season.season_number, i, downloaded)
        }
      }
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          episodeList: 'Episodenliste',
          seasons: 'Staffeln',
          season: {
            airDate: 'Ausstrahlung'
          }
        }
      },
      en: {
        item: {
          episodeList: 'Episode list',
          seasons: 'Seasons',
          season: {
            airDate: 'Air Date'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
.label {
  font-weight: bold;
  /* text-transform: uppercase; */
}
.card-body {
  padding: 5px;
}
.card-body .info {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-body .info .pull-right{
  float: right;
}
.card-body .character {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a {
  color: #ffbf58;
}
a:hover {
  color: #ffbf58;
}
.swiper-scrollbar {
  background: rgba(255, 255, 255, 0.1);
}
.swiper-scrollbar-drag {
  background: rgba(255, 255, 255, 0.5);
}
* > .fa-hover-show,
.actions:hover .fa-hover-hidden {
  display: none;
}
.actions:hover .fa-hover-show {
  display: inline-block;
}
.photo {
  cursor: pointer;
}
.icon {
  cursor: pointer;
}
.icon.downloaded {
  color: limegreen;
}
</style>
