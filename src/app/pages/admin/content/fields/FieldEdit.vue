<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialognef" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark to="/admin/content">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit content field</v-toolbar-title>
        </v-toolbar>
        <v-container>
           <div class="box">
             <div class="columns">
               <div class="column">
                 <div class="field">
                   <label class="label">Field name</label>
                   <div class="control">
                     <v-text-field
                     v-model="field.name"
                     label="Field name"
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
                      <v-checkbox v-model="field.sortable"/>
                   </div>
                 </div>
                 <div class="field">
                   <label class="label">Multi value allowed</label>
                   <div class="control">
                      <v-checkbox v-model="field.multiValue"/>
                   </div>
                 </div>
               </div>
             </div>
             <div class="buttons">
               <v-btn type="submit" color="primary" :disabled="field.name === '' || field.type === ''" @click="edit()">Edit field</v-btn>
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
  name: 'fieldEdit',
  mixins: [notifier],
  firebase: {
    contents: contentsRef,
    fields: fieldsRef
  },
  data () {
    return {
      dialognef: true,
      field: null,
      multiValue: false,
      sortable: false,
      fieldType: {
        id: '',
        label: 'Field type'
      },
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
  props: ['edit-field'],
  created () {
    this.field = Object.assign(
      {},
      (this.fields.filter((field) => {
        return (field['.key'] === this.$route.params.key)
      }))[0]
    )
    this.fieldType.id = this.field.type
    this.fieldType.label = this.field.type
    this.fieldSelect = this.fieldType.id
  },
  methods: {
    edit () {
      let f = {
        name: this.field.name,
        type: this.fieldSelect,
        multiValue: this.field.multiValue,
        sortable: this.field.sortable
      }
      this.editField(this.field, f)
      this.$router.push({ path: '/admin/content' })
    }
  },
  components: {
    checkbox
  }
}

</script>

<style lang="sass">

</style>
