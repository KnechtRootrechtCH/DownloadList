<template>
  <div>
    <b-navbar variant="dark" type="dark" toggleable="sm">
      <b-navbar-brand to="/Info">
        <img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="Nix">
        Nix
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/movies">{{ $t("nav.movies") }}</b-nav-item>
          <b-nav-item to="/series">{{ $t("nav.tv") }}</b-nav-item>
          <b-nav-item to="/list">{{ $t("nav.myList") }}</b-nav-item>

        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/info" right>{{ $t("nav.about") }}</b-nav-item>
          <b-nav-item v-on:click="signOut" right>{{ $t("nav.signout") }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import firebase from 'firebase'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'

export default {
  name: 'Navigation',
  computed: {
    userIcon () {
      return faUser
    },
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
          home: 'Startseite',
          movies: 'Filme',
          tv: 'Serien',
          myList: 'Meine Liste',
          signout: 'SignOut',
          about: 'Info'
        }
      },
      en: {
        nav: {
          home: 'Home',
          movies: 'Movies',
          tv: 'Series',
          myList: 'My List',
          signout: 'SignOut',
          about: 'Info'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
