<template>
  <div class="login">
    <form v-on:submit.prevent="signIn">
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
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.message = ''
          this.hasMessage = false
          this.$store.commit('setUser')
          this.$store.dispatch('getFirebaseUserData')
          this.$router.replace('/')
        },
        (err) => {
          this.message = err.message
          this.hasMessage = true
        }
      )
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
