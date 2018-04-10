<template>
  <div id="comments" v-if="item && (editMode || item.comments)">
    <div class="content">
      <h5 class="label">{{ $t('item.comments')}}</h5>
      <div v-if="item.comments">
        <div v-for="comment in item.comments" :key="comment.id" class="comment">
          <b-card no-body bg-variant="dark" text-variant="light">
            <b-card-header>
              <div class="author">{{ comment.author }}</div>
              <div class="time">{{ getTime(comment) }}</div>
            </b-card-header>
            <b-card-body class="card-text">
              {{ comment.text }}
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
    <div v-if="editMode">
         <b-form-textarea class="comments-input" id="comments-textarea"
            v-model="commentText"
            v-bind:placeholder="$t('item.edit.placeholder')"
            :rows="5">
        </b-form-textarea>
        <div class="comments-actions">
        <b-button class="comments-submit" @click="addComment">{{ $t('item.edit.submit') }}</b-button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ItemComments',
  props: ['item', 'editMode'],
  data () {
    return {
      commentText: ''
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    getTime (comment) {
      return this.$moment(comment.time).format('DD.MM.YYYY HH:mm')
    },
    addComment () {
      let comment = {}
      let timestamp = this.$moment().format()
      comment.time = timestamp
      comment.author = this.$store.getters.user.email
      comment.text = this.commentText

      this.$store.dispatch('addItemComment', {
        key: this.item.key,
        comment: comment})
      this.commentText = null
      this.$emit('addCommentDone')
    }
  },
  i18n: {
    messages: {
      de: {
        item: {
          comments: 'Kommentare',
          edit: {
            submit: 'Kommentar hinzufügen',
            placeholder: '...'
          }
        }
      },
      en: {
        item: {
          comments: 'Comments',
          edit: {
            submit: 'Add comment',
            placeholder: '...'
          }
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
.card-body {
  padding: 12px 20px 12px 20px;
}
.author {
  font-weight: bold;
}
.comments-input {
  margin-bottom: 10px;
}
.comments-submit {
  float: right;
}
</style>
