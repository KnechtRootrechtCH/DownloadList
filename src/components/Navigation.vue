<template>
  <div class="navigation" v-bind:class="{ 'externalData' : usesExternalData }">
    <b-navbar v-bind:variant="variant" v-bind:type="variant" toggleable="sm" fixed="top">
      <b-navbar-brand to="/">
        <img src="../assets/imgs/firebase.png" width="30" height="30" class="d-inline-block align-top" alt="Nix">
        Varda
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/browse/discover" class="no-wrap">{{ $t("nav.discover") }}</b-nav-item>
          <b-nav-item to="/browse/movie" class="no-wrap">{{ $t("nav.movies") }}</b-nav-item>
          <b-nav-item to="/browse/tv" class="no-wrap">{{ $t("nav.tv") }}</b-nav-item>
          <b-nav-item to="/list" class="no-wrap">{{ $t("nav.downloadList") }}</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-dropdown-divider class="d-sm-none"></b-dropdown-divider>
          <b-nav-item to="/profile" class="d-sm-none" v-if="user">{{ userName }}<span v-if="isAdmin">&nbsp;({{ $t('nav.admin')}})</span></b-nav-item>
          <b-nav-item to="/chat" class="d-sm-none">{{ $t("nav.chat") }}</b-nav-item>
          <b-nav-item to="/about" class="d-sm-none">{{ $t("nav.about") }}</b-nav-item>
          <b-nav-item v-if="user" v-on:click="signOut" class="d-sm-none">{{ $t("nav.signout") }}</b-nav-item>
          <b-nav-item-dropdown right class="d-none d-sm-inline" no-caret>
            <template slot="button-content">
              <font-awesome-icon :icon="icon('cog')" class="navigation-icon"/>
            </template>
            <b-dropdown-item to="/profile" v-if="user">{{ userName }}<span v-if="isAdmin">&nbsp;({{ $t('nav.admin')}})</span></b-dropdown-item>
            <b-dropdown-item to="/chat">{{ $t("nav.chat") }}</b-dropdown-item>
            <b-dropdown-item to="/about">{{ $t("nav.about") }}</b-dropdown-item>
            <b-dropdown-item v-if="user" v-on:click="signOut" right>{{ $t("nav.signout") }}</b-dropdown-item>
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
    variant () {
      if (this.usesExternalData) {
        return 'danger'
      } else {
        return 'dark'
      }
    },
    user () {
      return this.$store.getters.user
    },
    userName () {
      if (!this.user) {
        return null
      }
      if (this.user.displayName) {
        return this.user.displayName
      } else {
        return this.user.email
      }
    },
    isAdmin () {
      return this.userSettings && this.userSettings.isAdmin
    },
    userSettings () {
      return this.$store.getters.userSettings
    },
    usesExternalData () {
      return this.$store.getters.user && this.$store.getters.dataUserId !== this.$store.getters.user.uid
    },
    externalDataId () {
      if (this.usesExternalData) {
        return this.$store.getters.dataUserId
      } else {
        return null
      }
    }
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
          profile: 'Profile',
          admin: 'Administrator',
          signout: 'SignOut',
          chat: 'Chat',
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
          profile: 'Profile',
          admin: 'Administrator',
          signout: 'SignOut',
          chat: 'Chat',
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
.no-wrap a {
  overflow: hidden;
  white-space: nowrap;
}
.externalData .navbar-brand {
  color: white;
}
.externalData .nav-link {
  color: white;
}
.externalData svg {
  color: white;
}
.externalData .navbar-toggler-icon {
  color: white !important;
}
</style>
