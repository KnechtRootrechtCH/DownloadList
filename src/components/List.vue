<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <h3>Comming soon&trade;</h3>
    <p>Patience you must have, my young padawan &mdash; Yoda </p>
    <div class="download-list">
      <div class="download-item"
        v-for="(item) in items" :key="item.id">
        <div class="card text-white bg-dark" >
          <h5 class="card-header">{{ item.title }} ({{ getReleaseYear(item.release_date) }})</h5>
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm hidden-sm download-item-media">
                  <progressive-img class="download-item-poster" v-bind:src="getPoster(item.poster_path)"></progressive-img>
                </div>
                <div class="col-sm-6 download-item-info">
                  <h5 class="card-title">Special title treatment</h5>
                  <p class="card-text">blublbbasdf sadfasf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    items () {
      return this.$store.getters.movies
    }
  },
  methods: {
      getPoster (path) {
      if (path) {
        return 'http://image.tmdb.org/t/p/w200' + path
      } else {
        return this.$store.getters.fallbackMovieBackdrop
      }
    },
    getReleaseYear (date) {
      if (date) {
        return date.substring(0, 4)
      } else {
        return ''
      }
    }
  },
  i18n: {
    messages: {
      de: {
        list: {
          header: 'Meine Liste'
        }
      },
      en: {
        list: {
          header: 'My list'
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  margin: 10px 30px;
}
.download-item {
  margin-bottom: 10px;
}
.download-item .container {
  width: 100%;
  margin: 0;
  padding: 0;
}
.download-item .row {
  width: 100%;
  margin: 0;
  padding: 0;
}
.download-item .download-item-media {
  padding: 0;
  margin: 0;
  max-width: 200px;
}
.download-item .download-item-info {
  width: 100%;
  margin: 0;
  padding: 0;
 
}
/*
.download-item-media {
  width: 100px;
  max-width: 100px;
}*/
</style>
