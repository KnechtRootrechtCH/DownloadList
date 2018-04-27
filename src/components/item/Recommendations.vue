<template>
  <div>
    <div class="content" v-if="recommendations && recommendations.length > 0">
      <h5 class="label">{{ $t('recommendations.' + mediaType)}}</h5>
      <swiper :options="swiperOptions" ref="mySwiper">
        <swiper-slide v-for="(recommendation) in recommendations" :key="recommendation.id">
          <div class="card border-dark media-card bg-dark text-faded">
              <div class="card-body">
                <div class="title"><router-link :to="'../' + mediaType + '/' + recommendation.id">{{ name(recommendation) }}</router-link></div>
                <div class="year">{{ year(recommendation) }}</div>
              </div>
              <div class="card-img-bottom" @click="clicked(recommendation)">
                <progressive-img class="photo" v-bind:src="poster(recommendation)" v-bind:fallback="picturePlaceholder" :blur="10"></progressive-img>
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

export default {
  name: 'ItemRecommendations',
  props: ['recommendations', 'mediaType'],
  mixins: [UtilsMixin, ImagesMixin],
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
    picturePlaceholder () {
      return this.getProfilePlaceholder(this.constants.IMAGESIZE.POSTER.W185)
    }
  },
  methods: {
    name (recommendation) {
      if (this.mediaType === this.constants.MEDIA_TYPE.TV) {
        return recommendation.name
      } else {
        return recommendation.title
      }
    },
    year (recommendation) {
      let moment = this.releaseMoment(recommendation)
      if (moment) {
        let formated = moment.format('YYYY')
        return formated
      }
    },
    releaseMoment (recommendation) {
      let date = null
      if (this.mediaType === this.constants.MEDIA_TYPE.TV) {
        date = recommendation.first_air_date
      } else {
        date = recommendation.release_date
      }
      if (date) {
        let moment = this.$moment(date)
        return moment
      }
    },
    clicked (recommendation) {
      this.routeTo('./' + recommendation.id)
    },
    poster (season) {
      return this.getPosterImage(season, this.constants.IMAGESIZE.POSTER.W185)
    }
  },
  i18n: {
    messages: {
      de: {
        recommendations: {
          movie: 'Empfehlungen',
          tv: 'Empfehlungen'
        }
      },
      en: {
        recommendations: {
          movie: 'Recommendations',
          tv: 'Recommendations'
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
.card-body .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-body .year {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-img-bottom {
  background-color: #343a40;
  cursor: pointer;
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
</style>
