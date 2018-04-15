<template>
  <div class="navigation">
    <b-navbar variant="dark" type="dark" toggleable="sm" fixed="top">
      <b-navbar-brand to="/">
        <img src="../assets/imgs/diamond.png" width="30" height="30" class="d-inline-block align-top" alt="Nix">
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/browse/discover">{{ $t("nav.discover") }}</b-nav-item>
          <b-nav-item to="/browse/movie">{{ $t("nav.movies") }}</b-nav-item>
          <b-nav-item to="/browse/tv">{{ $t("nav.tv") }}</b-nav-item>
          <b-nav-item to="/list">{{ $t("nav.downloadList") }}</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-dropdown-divider class="d-sm-none"></b-dropdown-divider>
          <b-nav-item to="/info" class="d-sm-none">{{ $t("nav.about") }}</b-nav-item>
          <b-nav-item v-on:click="signOut" class="d-sm-none">{{ $t("nav.signout") }}</b-nav-item>
          <b-nav-item-dropdown right class="d-none d-sm-inline" no-caret>
            <template slot="button-content">
              <font-awesome-icon :icon="icon('cog')" class="navigation-icon"/>
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
import IconsMixin from '../mixins/icons'

export default {
  name: 'Navigation',
  mixins: [IconsMixin],
  components: {
  },
  computed: {
  },
  methods: {
    signOut () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('/authenticate')
      })
    }
  },
  i18n: {
    messages: {
      de: {
        nav: {
          home: 'Home',
          discover: 'Entdecken',
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
          discover: 'Discover',
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
*:focus {
    outline: none;
}
.navigation-icon {
  width: 20px;
  height: 20px;
}
.navigation .nav-link {
  font-size: 20px;
}
</style>
