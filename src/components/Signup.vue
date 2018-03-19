<template>
  <div class="sign-up">
    <form>
      <div class="form-group">
        <label for="email">Mail</label>
        <input type="email" v-model="email" class="form-control" placeholder="name@example.com">
        <small class="form-control-feedback" v-bind:class="{ 'text-warning': hasEmailMessage }">{{ emailMessage }}</small>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" class="form-control">
        <small class="form-control-feedback" v-bind:class="{ 'text-warning': hasPasswordMessage }">{{ passwordMessage }}</small>
      </div>
      <div class="form-group" v-bind:class="{ 'has-danger': hasPasswordRepeatMessage }">
        <label for="passwordRepeat">Password</label>
        <input type="password" v-model="passwordRepeat" class="form-control">
        <small class="form-control-feedback" v-bind:class="{ 'text-warning': hasPasswordRepeatMessage }">{{ passwordRepeatMessage }}</small>
      </div>
      <button type="submit" v-on:click="signUp" class="btn btn-yellow">Signup</button>
    </form>
    <small id="login" class="form-text">Go back to <router-link to="/authenticate">login</router-link>.</small>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'SignUp',
  data: function () {
    return {
      email: '',
      password: '',
      passwordRepeat: '',
      hasEmailMessage: false,
      emailMessage: '',
      hasPasswordMessage: '',
      passwordMessage: '',
      hasPasswordRepeatMessage: false,
      passwordRepeatMessage: ''
    }
  },
  methods: {
    signUp: function () {
      this.hasEmailMessage = false
      this.emailMessage = ''
      this.hasPasswordMessage = false
      this.passwordMessage = ''
      this.hasPasswordRepeatMessage = false
      this.passwordRepeatMessage = ''

      if (this.email === null || this.email === '' || !this.email.includes('@')) {
        this.emailMessage = 'Please enter a valid email address!'
        this.hasEmailMessage = true
        return
      }

      if (this.password === null || this.password === '' || this.password.length < 6) {
        this.passwordMessage = 'Passwords should be at least 6 characters long!'
        this.hasPasswordMessage = true
        return
      }

      if (this.password !== this.passwordRepeat) {
        this.passwordRepeatMessage = 'Passwords do not match!'
        this.hasPasswordRepeatMessage = true
        return
      }

      var that = this
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        function (user) {
          alert('Account successfully created.')
          that.$router.replace('movies')
        },
        function (err) {
          that.emailMessage = err.message
          that.hasEmailMessage = true
        }
      )
    }
  }
}
</script>

<style scoped>
.sign-up {
  margin-top: 40px
}
input {
  margin-top: 5px;
  margin-left: 25%;
  margin-right: 25%;
  width: 50%;
}
#login {
  margin-top: 10px;
}
</style>
