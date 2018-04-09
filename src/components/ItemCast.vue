<template>
  <div>
    <div class="content" v-if="cast">
      <span class="label">{{ $t('item.cast')}}</span>
      <swiper :options="swiperOptions" ref="mySwiper">
        <swiper-slide v-for="(person) in castFiltered" :key="person.credit_id">
          <div class="card border-dark media-card bg-dark text-faded">
              <div class="card-body">
                <div class="actor"><a v-bind:href="'https://www.themoviedb.org/person/' + person.id" target="_blank">{{ person.name }}</a></div>
                <div class="character">{{ person.character }}</div>
              </div>
              <div class="card-img-bottom">
                <progressive-img class="photo" v-bind:src="picture(person)" :blur="10"></progressive-img>
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
export default {
  name: 'ItemCast',
  props: ['cast'],
  data () {
    return {
      swiperOptions: {
        slidesPerView: 8,
        spaceBetween: 5,
        effect: 'slide',
        mousewheel: false,
        breakpoints: {
          400: {
            slidesPerView: 1
          },
          576: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3
          },
          992: {
            slidesPerView: 4
          },
          1200: {
            slidesPerView: 5
          },
          1400: {
            slidesPerView: 6
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
    }
  },
  methods: {
    open (url) {
      var win = window.open(url, '_blank')
      win.focus()
    },
    picture (person) {
      if (person.profile_path) {
        return 'https://image.tmdb.org/t/p/w185' + person.profile_path
      } else {
        return ''
      }
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
