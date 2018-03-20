<template>
  <div>
    <b-navbar variant="dark" type="dark" toggleable="sm">
      <b-navbar-brand to="/">
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
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  i18n: {
    messages: {
      de: {
        nav: {
          home: 'Startseite',
          movies: 'Filme',
          tv: 'Serien',
          myList: 'Meine Liste'
        }
      },
      en: {
        nav: {
          home: 'Home',
          movies: 'Movies',
          tv: 'Series',
          myList: 'My List'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
