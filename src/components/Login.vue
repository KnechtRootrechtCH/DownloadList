<template>
  <div class="login">
    <form>
      <div class="form-group">
        <label for="email">Mail</label>
        <input type="email" v-model="email" class="form-control" placeholder="name@example.com">
        <small class="form-control-feedback" v-bind:class="{ 'text-warning': hasMessage }">{{ message }}</small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" class="form-control">
      </div>
      <button type="submit" v-on:click="signIn" class="btn btn-yellow">Login</button>
    </form>
    <small id="signup" class="form-text">Don't have an account? Signup <router-link to="/signup">here</router-link>.</small>
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
          this.$router.replace('info')
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
  margin-top: 40px
}
input {
  margin-top: 5px;
  margin-left: 25%;
  margin-right: 25%;
  width: 50%;
}
#signup {
  margin-top: 10px;
}
</style>
