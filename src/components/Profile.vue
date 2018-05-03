<template>
  <div fluid class="profile">
    <progressive-img class="image" v-bind:src="image"></progressive-img>
    <div class="info">
      <div v-if="profile.displayName">{{ profile.displayName }}</div>
      <div v-if="profile.email">{{ profile.email }}</div>
      <div v-if="userSettings && userSettings.isAdmin">{{ $t('isAdmin') }}</div>
      <hr/>
      <div>{{ $t('uid')}}:</div>
      <div>{{ profile.uid }}</div>
      <hr/>
      <div v-if="usesExternalData">{{ $t('dataUid')}}:</div>
      <div v-if="usesExternalData">{{ dataUserId }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  computed: {
    profile () {
      return this.$store.getters.user
    },
    userSettings () {
      return this.$store.getters.userSettings
    },
    dataUserId () {
      return this.$store.getters.dataUserId
    },
    usesExternalData () {
      return this.$store.getters.dataUserId !== this.profile.uid
    },
    image () {
      if (this.profile.photoURL) {
        return this.profile.photoURL
      }
      return 'https://static.digitecgalaxus.ch/Files/4/9/2/3/9/4/7/dig_avatar_14.png?fit=inside%7C300:300'
    }
  },
  i18n: {
    messages: {
      de: {
        uid: 'User ID',
        dataUserId: 'Externe User ID',
        isAdmin: 'Adminstrator'
      },
      en: {
        uid: 'User ID',
        dataUid: 'External user ID',
        isAdmin: 'Adminstrator'
      }
    }
  }
}
</script>

<style scoped>
.profile {
  margin: 15px;
  padding-top: 10px;
}
.image {
  width: 100px;
  height: 100px;
  margin: 0 15px 15px 0;
}
</style>
