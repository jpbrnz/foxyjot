<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialognf" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon to="/admin/content">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Create content field</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <div class="box">
            <div class="columns">
              <div class="column">
                <div class="field">
                  <div class="control">
                    <v-text-field
                    v-model="fieldName"
                    label="Field Name"
                    required
                  ></v-text-field>
                  </div>
                </div>
                <div class="field">
                  <v-select
                    :items="fieldTypes"
                    :selectedElement="fieldType"
                    v-model="fieldSelect"
                    label="Field type"
                    item-text="label"
                    item-value="id"
                    chips
                    max-height="auto"
                    autocomplete
                  >
                    <template slot="selection" slot-scope="data">
                      <v-chip
                        :selected="data.selected"
                        :key="JSON.stringify(data.id)"
                        close
                        @input="data.parent.selectItem(data.id)"
                      >
                        {{ data.item.label }}
                      </v-chip>
                    </template>
                  </v-select>
                </div>
                <div class="field">
                  <label class="label">Sortable by default</label>
                  <div class="control">
                     <v-checkbox v-model="sortable"/>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Multi value allowed</label>
                  <div class="control">
                     <v-checkbox v-model="multiValue"/>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <v-btn type="submit" color="primary" :disabled="fieldName === '' || fieldType.id === ''" @click="add()">Add field</v-btn>
              <router-link to="/admin/content" color="error" tag="v-btn">Cancel</router-link>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import checkbox from '@/app/components/shared/Checkbox'
import { contentsRef, fieldsRef } from '@/app/firebase_config'
import notifier from '@/app/mixins/notifier'
export default {
  name: 'fieldNew',
  mixins: [notifier],
  firebase: {
    contents: contentsRef,
    fields: fieldsRef
  },
  data () {
    return {
      fieldSelect: '',
      dialognf: true,
      fieldName: '',
      fieldType: {
        id: '',
        label: 'Field type'
      },
      sortable: false,
      multiValue: false,
      fieldTypes: [
        {
          id: 'textarea',
          label: 'Textarea'
        },
        {
          id: 'textbox',
          label: 'Textbox'
        },
        {
          id: 'integer',
          label: 'Integer'
        },
        {
          id: 'boolean',
          label: 'Boolean'
        },
        {
          id: 'url',
          label: 'Url'
        },
        {
          id: 'richtextbox',
          label: 'Richtextbox'
        },
        {
          id: 'tags',
          label: 'Tags'
        },
        {
          id: 'select',
          label: 'Select'
        },
        {
          id: 'image',
          label: 'Image'
        }
      ]
    }
  },
  props: ['add-field'],
  methods: {
    add () {
      let f = {
        name: this.fieldName,
        type: this.fieldSelect,
        sortable: this.sortable,
        multiValue: this.multiValue
      }
      this.addField(f)
      this.fieldName = ''
      this.fieldType = {
        id: '',
        label: 'Field type'
      }
      this.sortable = false
      this.multiValue = false
      this.$router.push({ path: '/admin/content' })
    },
    resetForm () {
      this.name = ''

      for (var key in this.supports) {
        this.supports[key] = false
      }
    }
  },
  components: {
    checkbox
  }
}

</script>

<style>

</style>
