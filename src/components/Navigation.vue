<template>
  <div>
    <b-navbar variant="dark" type="dark" toggleable="sm">
      <b-navbar-brand to="/">
        <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="Nix">
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/browse/movies">{{ $t("nav.movies") }}</b-nav-item>
          <b-nav-item to="/browse/tv">{{ $t("nav.tv") }}</b-nav-item>
          <b-nav-item to="/browse/search">{{ $t("nav.search") }}</b-nav-item>
          <b-nav-item to="/list">{{ $t("nav.downloadList") }}</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
          <template slot="button-content">
            <font-awesome-icon :icon="dropdownIcon" class="navigation-icon d-none d-sm-inline"/>
          </template>
            <b-dropdown-item to="/info">{{ $t("nav.about") }}</b-dropdown-item>
            <b-dropdown-item v-on:click="signOut" right>{{ $t("nav.signout") }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import firebase from 'firebase'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import dropdownIcon from '@fortawesome/fontawesome-free-solid/faCog'

export default {
  name: 'Navigation',
  components: {
    FontAwesomeIcon
  },
  computed: {
    dropdownIcon () {
      return dropdownIcon
    }
  },
  methods: {
    signOut () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('authenticate')
      })
    }
  },
  i18n: {
    messages: {
      de: {
        nav: {
          home: 'Home',
          search: 'Suche',
          movies: 'Filme',
          tv: 'Serien',
          downloadList: 'Download Liste',
          signout: 'SignOut',
          about: 'About'
        }
      },
      en: {
        nav: {
          home: 'Home',
          search: 'Search',
          movies: 'Movies',
          tv: 'TV Shows',
          downloadList: 'Download List',
          signout: 'SignOut',
          about: 'About'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
