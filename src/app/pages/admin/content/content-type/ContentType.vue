<template>
  <v-container fluid class="contentType mt-5">
   <!-- notification -->
   <v-snackbar
     v-if="notification.message"
     :value="true"
     :bottom="y === 'bottom'"
     :multi-line="mode === 'multi-line'"
     :vertical="mode === 'vertical'"
     v-model="snackbar"
   >
     {{notification.message}}
     <v-btn flat color="green" @click.native="snackbar = false"><v-icon>close</v-icon> Close</v-btn>
   </v-snackbar>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Content Type</span>
            </v-card-title>
            <v-card-text>
              <div class="field">
                <label class="label">Content type name</label>
                <div class="control">
                  <v-text-field
                  v-if="!selectedContent"
                  label="e.g. Pages"
                  v-model="name"
                  required
                ></v-text-field>
                <v-text-field
                v-else
                label="e.g. Pages"
                v-model="selectedContent.name"
                required
              ></v-text-field>
                </div>
              </div>
              <label class="label">Edit content type</label>
              <div class="box" v-if="contentsLoaded">
                <v-menu offset-y>
                  <v-btn
                    slot="activator"
                    color="primary"
                    dark
                  >
                    {{selectedContentType.label}} <v-icon>expand_more</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      v-if="option"
                      v-for="(option, optionKey) in createdContentTypes"
                      :key="optionKey"
                      @click="selectContentType(option)"
                    >
                      <v-list-tile-title>{{option.label ? option.label : null }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn v-if="selectedContent" type="submit" class="error" @click="deleteMenuItem()">Delete</v-btn>
              </div>
              <v-flex xs12>
                <div class="my-3">
                  <v-btn v-if="selectedContent" type="submit" class="info--text" :disabled="!selectedContent.name || !checkedFields.length" @click="createMenuItem(true)">Edit</v-btn>
                  <v-btn v-else type="submit" class="primary" :disabled="!name || !checkedFields.length" @click="createMenuItem(false)">Create new</v-btn>
                </div>
              </v-flex>
              <br><br>
              <!-- Custom Fields -->
                <label class="label">Fields</label>
                <div class="field">
                  <v-list two-line subheader>
                    <v-list-tile avatar class="hovedit" v-for="(field, fieldKey) in checkedFields" :key="fieldKey" v-if="field.checked">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ field.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>
                          <span class="link-actions">
                            <v-icon v-if="fieldKey !== 0" @click="moveFieldUp(field, checkedFields[fieldKey - 1])">arrow_upward</v-icon>
                            <v-icon v-if="fieldKey !== checkedFields.length - 1" @click="moveFieldDown(field, checkedFields[fieldKey + 1])">arrow_downward</v-icon>
                            <span @mouseover="showDesc = !showDesc"><checkbox v-if="field.type === 'textbox'" v-model="field.sortable" /> </span>
                            <span v-if="showDesc && field.type === 'textbox'" class="has-text-danger is-size-7">Shown in table header</span>
                          </span>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card>
              <v-card-title class="primary white--text">
                <span class="headline">Content Fields</span>
              </v-card-title>
              <v-card-text>
                <label class="label">Available fields</label>
                <label class="label has-text-danger is-size-7" v-if="fields.length" >Select the fields you want to include in your content type</label>
                <div class="field is-grouped is-grouped-multiline">
                  <v-list two-line subheader>
                    <v-list-tile avatar class="hovedit" v-for="(field, fieldKey) in fields" :key="fieldKey">
                      <v-list-tile-action>
                        <v-checkbox v-model="field.checked"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ field.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>
                          <span class="link-actions">
                          <v-icon @click="removeField(field)">delete</v-icon>
                          <router-link :to="'/admin/content/fieldEdit/' + field['.key']"><v-icon>create</v-icon></router-link>
                          </span>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </div>
                <router-link to="/admin/content/fieldNew" class="primary" tag="v-btn">Add new field</router-link>
                <!-- View for edit/add new field -->
                <router-view :edit-field="editField" :add-field="addField" tag="v-btn"></router-view>
              </v-card-text>
            </v-card>
          </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import checkbox from '@/app/components/shared/Checkbox'
import dropdown from '@/app/components/shared/Dropdown'
import { contentsRef, fieldsRef } from '@/app/firebase_config'
import notifier from '@/app/mixins/notifier'
export default {
  name: 'content-type',
  mixins: [notifier],
  firebase: {
    contents: contentsRef,
    fields: fieldsRef
  },
  data () {
    return {
      snackbar: false,
      y: 'bottom',
      mode: '',
      name: '',
      sortable: false,
      showDesc: false,
      createdContentTypes: null,
      selectedContentType: {
        id: '',
        label: 'Select content type'
      },
      dropdownActive: false,
      selectedContent: null,
      contentsLoaded: false,
      selectedContntFields: null
    }
  },
  created () {
    this.clearChecked()
    this.loadContentTypes()
  },
  computed: {
    checkedFields () {
      return this.fields.filter(field => {
        return field.checked
      })
    }
  },
  methods: {
    loadContentTypes () {
      this.contentsLoaded = false
      this.selectedContentType = {
        id: '',
        label: 'Select content type'
      }
      this.createdContentTypes = this.contents.map(content => {
        return {
          id: content['.key'],
          label: content.name
        }
      })
      this.createdContentTypes.push({id: '', label: 'Select content type'})
      this.contentsLoaded = true
    },
    createMenuItem (edit) {
      let path
      if (edit) {
        path = this.selectedContent.name.toLowerCase()
      } else {
        path = this.name.toLowerCase()
      }
      path = path.replace(/^[, ]+|[, ]+$|[, ]+/g, '').trim()

      let selectedFields = this.checkedFields.map(field => {
        return {
          name: field.name,
          type: field.type,
          sortable: field.sortable,
          multiValue: field.multiValue
        }
      })

      let item = {
        name: this.name,
        path: `/admin/content/${path}`,
        icon: 'fa-file-text',
        fields: selectedFields
      }
      if (edit) {
        this.selectedContent.path = `/admin/content/${path}`
        this.selectedContent.fields = selectedFields
        let item = {...this.selectedContent}
        delete item['.key']
        this.$firebaseRefs.contents.child(this.selectedContent['.key']).set(item).then(() => {
          this.resetForm()
          this.loadContentTypes()
          this.showNotification('success', 'Content edited successfully')
        })
      } else {
        this.$firebaseRefs.contents.push(item).then(() => {
          this.loadContentTypes()
          this.showNotification('success', 'Content type added successfully')
          this.resetForm()
        })
      }
    },
    deleteMenuItem () {
      this.$firebaseRefs.contents.child(this.selectedContent['.key']).remove()
        .then(() => {
          this.loadContentTypes()
          this.showNotification('success', 'Content type removed successfully')
          this.resetForm()
        })
    },
    resetForm () {
      this.name = ''
      this.selectedContent = null
      for (var fieldKey in this.fields) {
        this.fields[fieldKey].checked = false
      }
      for (var key in this.supports) {
        this.supports[key] = false
      }
    },
    addField (field) {
      this.$firebaseRefs.fields.push(field).then(() => {
        this.showNotification('success', 'Field added successfully')
      })
    },
    editField (field, f) {
      this.$firebaseRefs.fields.child(field['.key']).set(f).then(() => {
        this.showNotification('success', 'Field edited successfully')
      })
    },
    removeField (field) {
      this.$firebaseRefs.fields.child(field['.key']).remove()
        .then(() => {
          this.showNotification('success', 'Field removed successfully')
        })
    },
    moveFieldUp (field, previousField) {
      let itemCopy = Object.assign({}, field)
      let previousItemCopy = Object.assign({}, previousField)

      delete itemCopy['.key']
      delete previousItemCopy['.key']

      this.$firebaseRefs.fields.child(field['.key']).set(previousItemCopy)
      this.$firebaseRefs.fields.child(previousField['.key']).set(itemCopy)
    },
    moveFieldDown (field, nextField) {
      let itemCopy = Object.assign({}, field)
      let nextItemCopy = Object.assign({}, nextField)

      delete itemCopy['.key']
      delete nextItemCopy['.key']

      this.$firebaseRefs.fields.child(field['.key']).set(nextItemCopy)
      this.$firebaseRefs.fields.child(nextField['.key']).set(itemCopy)
    },
    clearChecked () {
      for (var key in this.fields) {
        delete this.fields[key]['checked']
      }
    },
    selectContentType (option) {
      this.selectedContentType = option
      this.selectedContent = this.contents.filter(content => {
        if (content.name === option.label) {
          return content
        }
      })[0]
      this.clearChecked()
      if (option.id) {
        this.mapFields()
      }
    },
    toggleDropdown () {
      this.dropdownActive = !this.dropdownActive
    },
    mapFields () {
      for (var j = 0; j < this.fields.length; j++) {
        for (var i = 0; i < this.selectedContent.fields.length; i++) {
          if (this.selectedContent.fields[i].name === this.fields[j].name) {
            this.selectedContent.fields[i].checked = true
            this.fields[j].checked = true
          }
        }
      }
    }
  },
  components: {
    checkbox,
    dropdown
  }
}

</script>

<style lang="scss" scoped>
.contentType {
  .nav-preview {
    padding-left: 15px;
  }

  .link-actions {
    display: none;
    i {
      font-size: 1rem;
    }
    span {
      cursor: pointer;
    }
  }

  .hovedit:hover .link-actions {
    display: inline;
    cursor: pointer;
    text-decoration: none;
    a {
      text-decoration: none;
    }
  }
  ul {
    list-style: none;
  }
}
</style>
