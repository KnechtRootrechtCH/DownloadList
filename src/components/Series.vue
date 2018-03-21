<template>
  <div class="tv">
    <h2>{{ $t("tv.header") }}</h2>
    <h3>Comming soon&trade;</h3>
    <p>Patience you must have, my young padawan &mdash; Yoda </p>
  </div>
</template>

<script>
export default {
  name: 'Series',
  components: {
  },
  data () {
    return {
    }
  },
  i18n: {
    messages: {
      de: {
        tv: {
          header: 'Serien',
          inputPlaceholder: 'Serie suchen…',
          released: 'Veröffentlicht'
        }
      },
      en: {
        tv: {
          header: 'TV Shows',
          inputPlaceholder: 'Search tv show…',
          released: 'Released'
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tv {
  margin: 10px 30px;
}
.suggestion-list {
  margin-top: 20px;
}
.suggestion-card {
  background-color: #343a40;
}
.suggestion-input {
  max-width: 300px;
}
.suggestion-card {
  cursor: pointer;
}
h5.card-title {
  margin-bottom: 4px;
}
div.toggle-icons {
  position: absolute;
  height: 30px;
  right: 15px;
  bottom: 15px;
}
div.info-icons {
  position: absolute;
  height: 30px;
  left: 15px;
  bottom: 15px;
}
.info-icon {
  color: white;
  width: 30px;
  height: 30px;
}
.add-icon {
  color: white;
}
.check-icon {
  color: limegreen;
}
.toggle-icon {
  width: 30px;
  height: 30px;
}
.priority-icon {
    color: darkgrey;
}
/*
.priority-icon:hover {
    color: white;
}
*/
.priority-icon-active {
    color: yellow;
}
/*
.priority-icon-active:hover {
    color: grey;
}
*/
.card-img-overlay {
  z-index: 10;
}

@media (min-width: 350px) {
    .card-columns {
        -webkit-column-count: 1;
        -moz-column-count: 1;
        column-count: 1;
    }
}

@media (min-width: 700px) {
    .card-columns {
        -webkit-column-count: 2;
        -moz-column-count: 2;
        column-count: 2;
    }
}

@media (min-width: 1050px) {
    .card-columns {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
    }
}

@media (min-width: 1400px) {
    .card-columns {
        -webkit-column-count: 4;
        -moz-column-count: 4;
        column-count: 4;
    }
}
@media (min-width: 1750px) {
    .card-columns {
        -webkit-column-count: 5;
        -moz-column-count: 5;
        column-count: 5;
    }
}
</style>
