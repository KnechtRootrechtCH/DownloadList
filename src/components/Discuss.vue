<template>
  <div class="discuss">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <b-alert variant="dark" show fade>
          <span class="heading">
            <span class="author">{{ message.author }}</span>&nbsp;&ndash;&nbsp;<span class="time">{{ getTime(message) }}</span>
            <span class="pull-right">
              <button v-if="isDeletable(message)" type="button" aria-label="Delete" class="close" @click.prevent="deleteMessage(message)">×</button>
            </span>
          </span>
          <hr>
          <p class="mb-0" v-linkified>
            {{ message.text }}
          </p>
        </b-alert>
      </div>
    </div>
    <div class="input fixed-bottom">
      <b-input-group>
        <b-input-group-prepend>
          <b-btn variant="light" @click.prevent="addMessage">
            <font-awesome-icon class="button-icon" :icon="icon('plus')" v-bind:class="{ 'disabled': !messageText}"/>
          </b-btn>
        </b-input-group-prepend>
        <b-form-input class="messages-input" id="messages-input"
          v-model="messageText"
          v-bind:placeholder="$t('placeholder')"
          v-on:keyup.enter.native.prevent="addMessage">
        </b-form-input>
      </b-input-group>
    </div>
  </div>
</template>

<script>
import IconsMixin from '../mixins/icons'

export default {
  name: 'Discuss',
  mixins: [IconsMixin],
  data () {
    return {
      messageText: '',
      showInput: false,
      limit: 50
    }
  },
  components: {
  },
  computed: {
    messages () {
      let messages = this.$store.getters.messagesArray
      messages = messages.slice(Math.max(messages.length - this.limit, 0))
      return messages
    },
    messageStringEntered () {
      return this.messageText !== null && this.messageText.length > 0
    }
  },
  methods: {
    getTime (message) {
      return this.$moment(message.time).format('DD.MM.YYYY HH:mm')
    },
    isDeletable (message) {
      let user = this.$store.getters.user
      let userSettings = this.$store.getters.userSettings
      let author = message.author
      let isAdmin = userSettings && userSettings.isAdmin
      return author === user.email || isAdmin
    },
    addMessage () {
      if (!this.messageText) {
        return
      }
      let message = {}
      let timestamp = this.$moment().format()
      message.time = timestamp
      message.author = this.$store.getters.user.email
      message.text = this.messageText
      this.$store.dispatch('addMessage', message)
      this.messageText = null
      this.showInput = false
    },
    deleteMessage (message) {
      if (!this.isDeletable(message)) {
        return
      }
      this.$store.dispatch('removeMessage', {
        messageId: message.key})
    },
    scrollToEnd () {
      window.scrollTo(0, document.body.scrollHeight)
    }
  },
  created () {
  },
  mounted () {
    setTimeout(this.scrollToEnd, 100)
  },
  watch: {
    messages (oldVal, newVal) {
      setTimeout(this.scrollToEnd, 100)
    }
  },
  i18n: {
    messages: {
      de: {
        discuss: 'Chat',
        addMessage: 'Kommentar hinzufügen',
        cancel: 'Abbrechen',
        submit: 'Hinzufügen',
        placeholder: 'Kommentar hinzufügen…'
      },
      en: {
        discuss: 'Chat',
        addMessage: 'Add message',
        cancel: 'Cancel',
        submit: 'Submit',
        placeholder: 'Add message…'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*:focus {
  outline: none;
}
.discuss {
  margin: 20px 20px 20px 20px;
}
.input {
  padding: 20px 20px 10px 20px;
  background-color: #17212b;;
}
.button-icon {
  color: #444444;
}
.button-icon.disabled {
  color: #AAA;
  cursor: pointer;
}
.label {
  font-weight: bold;
}
.messages {
  margin-bottom: 70px;
}
.message .alert{
  background-color: #343a40;
  color: white;
  border: none;
}
.pull-right {
  float: right;
}
.close {
  margin-left: 5px;
  color: white;
}
.author {
  font-weight: bold;
}
hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #aaa;
    margin: 2px 0 8px 0;
    padding: 0;
}
</style>
