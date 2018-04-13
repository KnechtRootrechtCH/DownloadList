<template>
  <b-list-group-item
    button
    class="action"
    v-bind:class="[{ active : isActive, 'clickable' : isClickable, 'inverted' : this.isActive }, 'button-' + this.color]">
    <font-awesome-icon
      :icon="actionIcon"
      class="icon"
      v-bind:class="icon"/>
    <span class="label">{{ label }}</span>
  </b-list-group-item>
</template>

<script>
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemAction',
  props: ['label', 'iconType', 'isActive', 'isClickable', 'color'],
  mixins: [IconsMixin],
  data () {
    return {
    }
  },
  components: {
  },
  computed: {
    actionIcon () {
      return this.icon(this.iconType)
    }
  }
}
</script>

<style scoped>
*:focus {
    outline: none;
}
.clickable {
  cursor: pointer;
}
.action {
  font-size: 18px;
  border-color: #f0f0f0;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  margin-bottom: 5px;
}
.action .label {
  float: right;
  text-transform: uppercase;
}
.action .icon {
  width: 18px;
  height: 18px;
}
</style>
