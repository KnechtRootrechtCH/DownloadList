<template>
  <div id="comments">
    <div class="content">
      <h5 class="label">{{ $t('item.comments')}}</h5>
      <div v-if="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <b-card no-body bg-variant="dark" border-variant="dark">
            <b-card-header
              header-bg-variant="dark"
              header-border-variant="secondary"
              header-text-variant="faded">
              <span class="author">{{ comment.author }}</span>
              <span class="time">{{ getTime(comment) }}</span>
            </b-card-header>
            <b-card-body class="card-text"
              body-text-variant="dark">
              {{ comment.text }}
            </b-card-body>
          </b-card>
        </div>
      </div>
      <div>
        <b-form-textarea class="comments-input" id="comments-textarea"
          v-model="commentText"
          v-bind:placeholder="$t('item.placeholder')"
          :rows="5">
        </b-form-textarea>
        <div class="comments-actions">
          <b-button v-bind:class="{ disabled : !commentStringEntered }" class="comments-submit" @click="addComment">{{ $t('item.submit') }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ItemComments',
  props: ['itemKey'],
  data () {
    return {
      commentText: ''
    }
  },
  components: {
  },
  computed: {
    comments () {
      return this.$store.getters.comments
    },
    commentStringEntered () {
      return this.commentText !== null && this.commentText.length > 0
    }
  },
  methods: {
    getTime (comment) {
      return this.$moment(comment.time).format('DD.MM.YYYY HH:mm')
    },
    addComment () {
      if (!this.commentStringEntered) {
        return
      }
      let comment = {}
      let timestamp = this.$moment().format()
      let key = this.itemKey
      comment.time = timestamp
      comment.author = this.$store.getters.user.email
      comment.text = this.commentText
      this.$store.dispatch('addComment', {
        key: key,
        comment: comment})
      this.commentText = null
    }
  },
  created () {
    this.$store.dispatch('getComments', this.itemKey)
  },
  i18n: {
    messages: {
      de: {
        item: {
          comments: 'Kommentare',
          addComment: 'Kommentar hinzufügen',
          submit: 'Hinzufügen',
          placeholder: 'Kommentar hinzufügen…'
        }
      },
      en: {
        item: {
          comments: 'Comments',
          addComment: 'Add comment',
          submit: 'Submit',
          placeholder: 'Add a comment…'
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
.label {
  font-weight: bold;
}
.comment-label {
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
.comments-input {
  margin-bottom: 10px;
}
.comments-submit {
  float: right;
}
</style>
