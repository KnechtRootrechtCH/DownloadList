<template>
  <div>
    <div class="content">
      <h5 class="label">{{ $t('item.seasons')}}</h5>
      <swiper :options="swiperOptions" ref="mySwiper">
        <swiper-slide v-for="(season) in seasons" :key="season.id">
          <div class="card border-dark media-card bg-dark text-faded">
              <div class="card-body">
                <div class="info">
                  <router-link :to="id + '/season/' + season.season_number">{{ season.name }}</router-link>
                </div>
                <div class="info">{{ year(season) }}
                  <span class="download-count pull-right" v-if="isSelected">
                    {{ getEpisodeDownloadCount(item, season.season_number) }}/{{ getEpisodeCount(season) }}
                    <span class="actions">
                      <font-awesome-icon
                        v-if="isDownloaded(season)"
                        @click="setSeasonDownloaded(item, season, false)"
                        :icon="icon('check')"
                        class="icon downloaded"/>
                      <font-awesome-icon
                        v-if="!isDownloaded(season)"
                        @click="setSeasonDownloaded(item, season, true)"
                        :icon="icon('clock')"
                        class="icon"/>
                    </span>
                  </span></div>
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
import ImagesMixin from '../../mixins/images'
import MetadataMixin from '../../mixins/metadata'
import TvShowsMixin from '../../mixins/tv'
import TransactionsMixin from '../../mixins/transactions'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemSeasons',
  props: ['id', 'item', 'seasons'],
  mixins: [UtilsMixin, ImagesMixin, MetadataMixin, TvShowsMixin, TransactionsMixin, IconsMixin],
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
      this.routeTo(this.id + '/season/' + season.season_number)
    },
    isDownloaded (season) {
      if (this.isSelected) {
        return this.getEpisodeDownloadCount(this.item, season.season_number) > 0 && this.getEpisodeDownloadCount(this.item, season.season_number) === this.getEpisodeCount(season)
      }
      return false
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
