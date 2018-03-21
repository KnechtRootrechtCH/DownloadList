<template>
  <div class="list">
    <h2>{{ $t("list.header") }}</h2>
    <h3>Comming soon&trade;</h3>
    <p>Patience you must have, my young padawan &mdash; Yoda </p>
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
</style>
