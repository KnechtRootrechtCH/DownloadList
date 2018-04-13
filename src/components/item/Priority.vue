<template>
  <b-list-group-item
    button
    class="action"
    @click="increase()"
    v-bind:class="[{ 'clickable' : isClickable, 'inverted' : this.isActive }, 'button-' + this.color]">
    <font-awesome-icon
      v-for="p in priorities"
      :key="p"
      :icon="actionIcon"
      class="icon clickable"
      v-bind:class="[{ 'highlighted' : has(p) }, icon]"
      @click.stop="setPriority(itemKey, p)" @mouseover="hoverPriority = p" @mouseout="hoverPriority = constants.PRIORITY.MIN + 1"/>
      <span class="label">{{ label.toUpperCase() }}</span>
  </b-list-group-item>
</template>

<script>
import UtilsMixin from '../../mixins/utils'
import IconsMixin from '../../mixins/icons'

export default {
  name: 'ItemPriority',
  props: ['itemKey', 'current', 'label', 'iconType', 'isClickable', 'isActive', 'color'],
  mixins: [UtilsMixin, IconsMixin],
  data () {
    return {
      hoverPriority: 10
    }
  },
  components: {
  },
  computed: {
    actionIcon () {
      return this.icon(this.iconType)
    }
  },
  methods: {
    has (priority) {
      return this.current <= priority || this.hoverPriority <= priority
    },
    increase () {
      let priority = this.current - 1
      if (priority < this.constants.PRIORITY.MAX) {
        priority = this.constants.PRIORITY.MIN
      }
      this.setPriority(this.itemKey, priority)
      this.hoverPriority = this.constants.PRIORITY.MIN + 1
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
.label {
  float: right;
}
.icon {
  width: 18px;
  height: 18px;
  opacity: 0.2;
}
.highlighted {
  opacity: 1;
}
</style>
