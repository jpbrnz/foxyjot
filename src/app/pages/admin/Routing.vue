<template>
  <v-container grid-list-lg class="mt-5">
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
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline" v-if="form.action === 'update'">Edit route</span>
              <span class="headline" v-else>Create new route</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.path"
                label="Path"
                ref="path"
              ></v-text-field>
              <div class="field">
                <v-select
                  v-model="form.template"
                  label="Select Template"
                  :items="templates"
                  item-text="displayName"
                  item-value="filename"
                  autocomplete
                ></v-select>
              </div>
              <div class="field">
                <v-select
                  v-model="form.contentType"
                  label="Select Content Type"
                  :items="contentTypes"
                  autocomplete
                ></v-select>
              </div>
              <div class="field">
                <v-select
                  v-model="form.content"
                  label="Select Content"
                  v-bind:items="optionsText"
                  item-text="text"
                  item-value="key"
                  autocomplete
                >
                </v-select>
              </div>
              <!-- buttons -->
              <div class="field">
                <div class="control">
                  <v-btn color="primary" v-if="form.action === 'add'" class="button is-info" @click="addRoute">
                    Add
                  </v-btn>
                  <v-btn color="primary" v-if="form.action === 'update'" class="button is-info" @click="updateRoute">
                    Update
                  </v-btn>
                  <v-btn @click="clear">Cancel</v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6>
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">Existing Routes:</span>
            </v-card-title>
            <v-card-text>
              <!-- dynamic routes list -->
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search Routes"
                single-line
                hide-details
                class="mb-3"
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="routes"
                :search="search"
                :pagination.sync="pagination"
                item-key="path"
                class="elevation-1"
              >
                <template slot="headers" slot-scope="props">
                  <tr>
                    <th
                      v-for="header in props.headers"
                      :key="header.text"
                      :class="['text-xs-left tbl sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                      @click="changeSort(header.value)"
                    >
                      {{ header.text }}
                    </th>
                  </tr>
                </template>
                <template slot="items" slot-scope="props">
                  <td class="post-actions-cell px-0 text-xs-center">
                    <v-btn icon class="mx-0" @click="editRoute(props.item)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteRoute(props.item['.key'])">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                  <td class="post-title-cell">
                    <a :href="props.item.path" target="_blank">{{props.item.path}}</a>
                  </td>
                  <td class="post-title-cell">{{getTemplateDisplayName(props.item.template)}}</td>
                  <td class="post-title-cell">{{selectContentByTypeAndId(props.item.contentType, props.item.content)['title'] || 'No Content'}}</td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- nav builder -->
      <nav-builder></nav-builder>
  </v-container>
</template>

<script>
import { contentsRef, routesRef } from '@/app/firebase_config'
import NavBuilder from '@/app/pages/admin/settings/NavBuilder'
import notifier from '@/app/mixins/notifier'
import templates from '@/app/templates/templates.json'

export default {
  data () {
    return {
      search: '',
      pagination: {
        sortBy: 'path'
      },
      items: [],
      snackbar: false,
      y: 'bottom',
      headers: [
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions'
        },
        {
          text: 'Path',
          align: 'left',
          sortable: true,
          value: 'path'
        },
        {
          text: 'Template',
          value: 'template',
          align: 'left',
          sortable: true
        },
        {
          text: 'Content',
          value: 'content',
          align: 'left',
          sortable: true
        }
      ],
      mode: '',
      form: {
        menu: false,
        path: '/',
        template: 'none' + templates[0].filename,
        contentType: 'none',
        content: 'none',
        action: 'add',
        key: '',
        select: [],
        contentItems: []
      },
      defaultRoutes: ['/', '/admin', '/login'],
      templates
    }
  },
  firebase: {
    contents: contentsRef,
    routes: routesRef
  },
  computed: {
    contentTypes () {
      return this.contents.map(content => {
        return content.name
      })
    },
    selectedContents () {
      return this.getContentsByType(this.form.contentType)
    },
    optionsVal () {
      return this.selectedContents.map(selectedContents => {
        return selectedContents['.key']
      })
    },
    optionsText () {
      return Object.keys(this.selectedContents).map(k => {
        let o = this.selectedContents[k]
        return {'key': `${o['.key']}`, 'text': `${o.title}`}
      })
    }
  },
  mixins: [notifier],
  methods: {
    changeSort (tbl) {
      if (this.pagination.sortBy === tbl) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = tbl
        this.pagination.descending = false
      }
    },
    selectContentByTypeAndId (type, id) {
      let contentsByType = this.getContentsByType(type)
      return contentsByType.filter(content => content['.key'] === id)[0] || {}
    },
    addRoute () {
      if (this.isPathAvailable(this.form.path)) {
        this.$firebaseRefs.routes.push({
          path: this.form.path.trim(),
          template: this.form.template,
          contentType: this.form.contentType,
          content: this.form.content
        })
          .then((res) => {
            let template = this.form.template
            this.showNotification('success', 'New route added successfully')
            this.$router.addRoutes([{
              path: this.form.path,
              component: () => import(`@/app/templates/${template}.vue`)
            }])
            this.clear()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showNotification('danger', 'A route with the same path already exists')
      }
    },
    editRoute (route) {
      this.form.content = route.content
      this.form.template = route.template
      this.form.contentType = route.contentType
      this.form.path = route.path
      this.form.action = 'update'
      this.form.key = route['.key']
      this.$refs.path.focus()
    },
    updateRoute () {
      this.$firebaseRefs.routes.child(this.form.key).set({
        content: this.form.content,
        path: this.form.path.trim(),
        template: this.form.template,
        contentType: this.form.contentType
      })
        .then(() => {
          let template = this.form.template
          this.showNotification('success', 'Route updated successfully')
          this.$router.addRoutes([{
            path: this.form.path,
            component: () => import(`@/app/templates/${template}.vue`)
          }])
          this.clear()
        })
    },
    deleteRoute (key) {
      this.$firebaseRefs.routes.child(key).remove()
        .then(() => {
          this.showNotification('success', 'Route deleted successfully')
        })
    },
    clear () {
      this.form.key = ''
      this.form.path = '/'
      this.form.contentType = ''
      this.form.content = ''
      this.form.template = ''
      this.form.action = 'add'
    },
    isPathAvailable (path) {
      let existingPaths = this.routes.map(route => {
        return route.path
      })
      existingPaths = existingPaths.concat(this.defaultRoutes)
      return !existingPaths.includes(this.form.path.trim())
    },
    getTemplateDisplayName (filename) {
      let displayName = ''
      templates.forEach(template => {
        displayName = template.filename === filename ? template.displayName : displayName
      })
      return displayName
    },
    getContentsByType (contentType) {
      let selectedContentsData = []
      let selectedContents = this.contents.filter(content => {
        return content.name === contentType
      })
      selectedContents.forEach(content => {
        let contentDataArray = this.convertContentDataToArray(content.data)
        selectedContentsData = selectedContentsData.concat(contentDataArray || [])
      })
      return selectedContentsData
    },
    convertContentDataToArray (contentData) {
      let contentDataArray = []
      for (let key in contentData) {
        contentDataArray.push({
          ...contentData[key],
          '.key': key
        })
      }
      return contentDataArray
    }
  },
  watch: {
    form: {
      deep: true,
      handler () {
        if (this.form.contentType === 'none') {
          this.form.content = 'none'
        }
      }
    }
  },
  components: {
    NavBuilder
  }
}
</script>

<style lang="scss" scoped>
.route-actions {
  padding-left: 10px;
  display: none;
  span {
    cursor: pointer;
    padding-right: 5px;
  }
}
ul {
  list-style: none;
}
td:hover .route-actions {
  display: inline-block;
}

.route-details {
  padding-left: 20px;
  margin-bottom: 10px;
}
.post-actions-cell {
  width: 12%;
}
.post-title-cell {
  width: 25%;
}
.post-category-cell {
  width: 20%;
}
.post-author-cell {
  width: 20%;
}
.post-tags-cell {
  width: 20%;
}
</style>
