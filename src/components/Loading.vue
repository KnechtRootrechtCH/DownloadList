<template>
  <div class="loading">
    <transition name="fade">
      <div class="overlay" v-if="loading">
        <div class="spinner"></div>
        <div class="text">{{ $t('loading') }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  data () {
    return {
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  i18n: {
    messages: {
      de: {
        loading: 'Lade Daten…'
      },
      en: {
        loading: 'Loading data…'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.overlay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0,0,0,0.75); /*dim the background*/
  padding: 250px 0 0 0;
}
.spinner {
    border: 16px solid #f0f0f0; /* Light grey */
    border-top: 16px solid #444499; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    margin: auto;
    animation: spin 2s linear infinite;
}
.text {
  margin: 10px auto;
  text-align: center;
  font-size: 24px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
