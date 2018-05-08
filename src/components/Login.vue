<template>
  <div class="login">
    <form v-on:submit.prevent="signInWithEmailAndPassword">
      <div class="form-group">
        <label for="email">Mail</label>
        <input type="email" v-model="email" class="form-control" placeholder="name@example.com">
        <small class="form-control-feedback" v-bind:class="{ 'text-warning': hasMessage }">{{ message }}</small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" class="form-control">
      </div>
      <button type="submit" class="btn btn-yellow">Login</button>
      <small id="signup" class="form-text">Don't have an account? Signup <router-link to="/signup">here</router-link>.</small>
      <img src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png" @click="signInWithGoogleAuth">
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data: function () {
    return {
      email: '',
      password: '',
      hasMessage: false,
      message: ''
    }
  },
  methods: {
    signInWithEmailAndPassword: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.message = ''
          this.hasMessage = false
          this.$router.replace('/')
        },
        (err) => {
          this.message = err.message
          this.hasMessage = true
        }
      )
    },
    signInWithGoogleAuth: function () {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.message = ''
        this.hasMessage = false
        this.$router.replace('/')
        /*
        let token = result.credential.accessToken
        let user = result.user
        */
      }).catch((error) => {
        console.log('error', error, this)
        this.message = error.message
        this.hasMessage = true
      })
    }
  }
}
</script>

<style scoped>
.login {
  margin-top: 40px;
  text-align: center;
}
input {
  margin-left: 25%;
  margin-right: 25%;
  margin-bottom: 10px;
  width: 50%;
}
#signup {
  margin-top: 10px;
}
</style>
