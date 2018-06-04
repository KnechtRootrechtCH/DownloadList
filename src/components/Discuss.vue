<template>
  <div class="discuss">
      <h2 class="discuss-header noselect">{{ $t('discuss') }}</h2>
      <div>
        <b-form-textarea class="messages-input" id="messages-textarea"
          v-if="showInput"
          v-model="messageText"
          v-bind:placeholder="$t('placeholder')"
          :rows="5">
        </b-form-textarea>
        <div class="messages-actions">
          <b-button variant="dark" v-if="!showInput" class="messages-button" @click="showInput = true">{{ $t('addMessage') }}</b-button>
          <b-button variant="dark" v-if="showInput && !messageStringEntered" class="messages-button" @click="showInput = false">{{ $t('cancel') }}</b-button>
          <b-button variant="dark" v-if="showInput && messageStringEntered" v-bind:class="{ disabled : !messageStringEntered }" class="messages-button" @click="addMessage">{{ $t('submit') }}</b-button>
        </div>
      </div>

      <div v-if="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <b-card no-body bg-variant="dark" border-variant="dark">
            <b-card-header
              header-bg-variant="default"
              header-border-variant="secondary"
              header-text-variant="default">
              <span class="author">{{ message.author }}</span>
              <span class="time">{{ getTime(message) }}
                <font-awesome-icon
                  v-if="isDeletable(message)"
                  @click="removeMessage(message)"
                  :icon="icon('trash')"
                  class="icon"
                  v-bind:class="icon"/>
              </span>
            </b-card-header>
            <b-card-body
              class="card-text message-text"
              v-html="message.text"
              v-linkified
              body-bg-variant="default"
              body-border-variant="default"
              body-text-variant="default">
            </b-card-body>
          </b-card>
        </div>
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
      showInput: false
    }
  },
  components: {
  },
  computed: {
    messages () {
      let messages = this.$store.getters.messagesArray
      return messages.reverse()
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
      return author === user.email && isAdmin
    },
    addMessage () {
      if (!this.messageStringEntered) {
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
    removeMessage (message) {
      this.$store.dispatch('removeMessage', {
        messageId: message.key})
    }
  },
  created () {
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
        placeholder: 'Add a message…'
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
  margin: 20px 20px 0 20px;
}
.label {
  font-weight: bold;
}
.message-label {
  font-weight: bold;
}
.card {
  margin-bottom: 10px;
}
.content .card-body {
  padding: 12px 20px 12px 20px;
  background-color: rgb(240, 240, 240);
}
.author {
  float: left;
}
.time {
  float: right;
}
.icon {
  margin-left: 5px;
}
.icon:hover {
  color: red;
}
.messages-input {
  margin-bottom: 10px;
}
.messages-button {
  width: 100%;
  margin: 0 0 20px 0;
}
</style>
