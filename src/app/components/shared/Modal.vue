<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="490">
      <v-card>
        <v-card-title class="headline">{{ header }}</v-card-title>
        <v-card-text>
          <section class="modal-card-body" v-if="kind == 'addField' || kind == 'addPage' || kind == 'addSetting'">
            <v-text-field
              v-if="kind == 'addField'"
              label="Property"
              v-model="fieldName"
            ></v-text-field>
            <v-text-field
              v-if="kind == 'addPage'"
              label="Page"
              v-model="pageName"
            ></v-text-field>
            <v-text-field
              v-if="kind == 'addSetting'"
              label="Setting"
              v-model="settingName"
              ></v-text-field>
          </section>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="kind == 'logout'">
            <v-btn color="primary" class="button is-success" @click="$emit('confirmLogout')">Logout</v-btn>
            <v-btn class="button" @click="$emit('close')">Cancel</v-btn>
          </div>
          <div v-else>
            <template v-if="kind == 'deletePage' || kind == 'deleteField' || kind == 'deleteSetting' || kind == 'deleteContent' || kind == 'bulkDeleteSelected'">
              <v-btn color="primary" class="button is-success" @click="deleteObj()">Confirm</v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" class="button is-success" @click="add()">Add</v-btn>
            </template>
            <v-btn class="button" @click="$emit('close')">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'modal',
  data () {
    return {
      fieldName: '',
      pageName: '',
      settingName: '',
      dialog: true
    }
  },
  methods: {
    add (event) {
      if (this.kind === 'addField') { this.$emit('addField', this.fieldName) }
      if (this.kind === 'addPage') { this.$emit('addPage', this.pageName) }
      if (this.kind === 'addSetting') { this.$emit('addSetting', this.settingName) }
    },
    deleteObj () {
      if (this.kind === 'deleteField') { this.$emit('confirmDeleteField') }
      if (this.kind === 'deletePage') { this.$emit('confirmDeletePage') }
      if (this.kind === 'deleteSetting') { this.$emit('confirmDeleteSetting') }
      if (this.kind === 'deleteContent') { this.$emit('confirmDeleteContent') }
      if (this.kind === 'bulkDeleteSelected') { this.$emit('selectBulkActions') }
    }
  },
  props: {
    header: {
      type: String,
      required: true,
      default: '!Error'
    },
    subHeader: {
      type: String,
      required: false,
      default: '!Error'
    },
    kind: {
      type: String
    }
  }
}
</script>
