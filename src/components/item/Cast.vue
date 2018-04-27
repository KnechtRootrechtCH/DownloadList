<template>
  <div>
    <div class="content" v-if="cast && castFiltered.length > 0">
      <h5 class="label">{{ $t('item.cast')}}</h5>
      <swiper :options="swiperOptions" ref="mySwiper">
        <swiper-slide v-for="(person) in cast" :key="person.credit_id">
          <div class="card border-dark media-card bg-dark text-faded">
              <div class="card-body">
                <div class="actor"><a v-bind:href="'https://www.themoviedb.org/person/' + person.id" target="_blank">{{ person.name }}</a></div>
                <div class="character">{{ person.character }}</div>
              </div>
              <div class="card-img-bottom">
                <a v-bind:href="'https://www.themoviedb.org/person/' + person.id" target="_blank">
                  <progressive-img class="photo" v-bind:src="picture(person)" v-bind:fallback="picturePlaceholder" :blur="10"></progressive-img>
                </a>
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
  name: 'ItemCast',
  props: ['cast'],
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
    castFiltered () {
      let filtered = this.cast.filter(c => c.profile_path !== null)
      return filtered
    },
    picturePlaceholder () {
      return this.getProfilePlaceholder(this.constants.IMAGESIZE.PROFILE.W185)
    }
  },
  methods: {
    open (url) {
      let win = window.open(url, '_blank')
      win.focus()
    },
    picture (person) {
      return this.getProfileImage(person, this.constants.IMAGESIZE.PROFILE.W185)
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          cast: 'Besetzung'
        }
      },
      en: {
        item: {
          cast: 'Cast'
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
.card-body .actor {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-body .character {
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
