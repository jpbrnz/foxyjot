<template>
  <v-menu offset-y>
    <v-btn
      slot="activator"
      color="primary"
      dark
    >
      {{selectedElement.label}} <v-icon>expand_more</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile
        v-if="option"
        v-for="(option, optionKey) in options"
        :key="optionKey"
        @click="selectOption(option)"
      >
        <v-list-tile-title>{{option.label ? option.label : null }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'dropdown',
  data () {
    return {
      dropdownActive: false
    }
  },
  methods: {
    toggleDropdown () {
      this.dropdownActive = !this.dropdownActive
    },
    selectOption (option) {
      this.selectedElement.id = option.id
      this.selectedElement.label = option.label
      if (option.id === 'newPage') {
        this.$emit('addNewPage')
      } else if (option.id === 'delete') {
        this.$emit('bulkDelete')
      } else {
        this.$emit('selectBulkActions')
      }
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedElement: {
      type: Object,
      required: true
    }
  }
}
</script>
