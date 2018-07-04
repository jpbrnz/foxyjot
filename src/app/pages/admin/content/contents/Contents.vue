<template>
  <v-layout>
    <v-container grid-list-lg class="mt-5">
      <v-card>
        <v-card-text>
         <v-container id="posts" v-if="loaded">

            <!-- Page title -->
            <div class="content-heading">
              <h3 class="is-size-3">{{ content.name }}</h3>
              <router-link class="primary" v-if="$route.name !== 'new'" :to="'/admin/content/' + $route.params.key + '/new'" tag="v-btn">Add New</router-link>
              <router-link flat small :to="{ name: 'Routing' }" slot="activator" href="admin/routing" class="primary--text" tag="v-btn">Add New Route  <v-icon right>library_add</v-icon></router-link>
            </div>

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

            <!-- modal for post delete -->
            <transition mode="out-in" name="fade">
              <modal @close="showModal = false" :kind="kind" @confirmDeleteContent='confirmDeleteContent()' @selectBulkActions='selectBulkActions()' v-if="showModal" :header="header"/>
            </transition>

            <!-- New content form loaded via router -->
            <router-view :add-content="addContent" :fields="content.fields" :update-content="updateContent" :contents="contentData" :key="$route.name + ($route.params.key || '')"></router-view>
            <v-divider class="mt-3"></v-divider>
            <div v-if="$route.name != 'edit'">
            <!-- States -->
            <div class="filters">
              <div class="states">
                <v-container>
                  <v-chip class="state" @click="selectedState = 'all'" :class="{ 'activeState': selectedState === 'all' }">
                    <v-avatar class="primary white--text">{{ allContents }}</v-avatar>
                    <span>All</span>
                  </v-chip>

                  <v-chip class="state" @click="selectedState = 'published'" :class="{ 'activeState': selectedState === 'published' }">
                    <v-avatar class="primary white--text">{{ publishedContent.length }}</v-avatar>
                    <span>Published</span>
                  </v-chip>

                  <v-chip class="state" @click="selectedState = 'saved'" :class="{ 'activeState': selectedState === 'saved' }">
                    <v-avatar class="primary white--text">{{ savedContent.length }}</v-avatar>
                    <span>Saved</span>
                  </v-chip>
                </v-container>
              </div>
            </div>

            <v-container grid-list-xl>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <!-- Dropdown filters -->
                    <div >
                      <!-- Categories
                      <dropdown :options="postsList" :selectedElement="params.category" />-->
                      <!-- Bulk actions -->
                      <dropdown :options="bulkActions" :selectedElement="params.bulkAction" @selectBulkActions="selectBulkActions()" @bulkDelete="bulkDelete()"/>
                    </div>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-data-table
              v-model="contentData"
              :search="search"
              :headers="headers"
              :items="filteredContent"
              :pagination.sync="pagination"
              class="elevation-1"
            >
              <template slot="headers" slot-scope="props">
                <tr>
                  <th>
                  </th>
                  <th class="text-xs-left">
                    <span>Actions</span>
                  </th>
                  <th class="text-xs-left">
                    <span>Created</span>
                  </th>
                  <th class="text-xs-left" v-for="(hdr, hdrKey) in contentData[0]" :key="hdrKey" v-if="findField(hdrKey)">
                    {{ hdrKey }}
                  </th>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr>
                  <td>
                    <v-checkbox
                      v-model="props.item.selected"
                      :input-value="props.item.selected"
                      primary
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td class="post-actions-cell px-0">
                    <v-btn icon class="mx-0" :to="'/admin/content/' + $route.params.key + '/edit/' + props.item['.key']">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteContent(props.item)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                  <td class="post-title-cell">
                    {{ formatDate(props.item.created) }}
                  </td>
                  <td v-for="(item, key) in props.item" :key="key" v-if="findField(key)">
                    {{ item }}
                  </td>
                </tr>
              </template>
            </v-data-table>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { contentsRef, db } from '@/app/firebase_config'
import notifier from '@/app/mixins/notifier'
import modal from '@/app/components/shared/Modal'
import dropdown from '@/app/components/shared/Dropdown'
import checkbox from '@/app/components/shared/Checkbox'
import contentFilters from '@/app/mixins/contentFilters'

export default {
  name: 'contents',
  data () {
    return {
      search: '',
      items: [],
      pagination: {
        sortBy: 'created'
      },
      headers: [
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions'
        },
        {
          text: 'Created',
          align: 'left',
          sortable: true,
          value: 'created'
        },
        {
          text: 'Author',
          align: 'left',
          sortable: true,
          value: 'author'
        },
        {
          text: 'Title',
          align: 'left',
          sortable: true,
          value: 'title'
        }
      ],
      snackbar: false,
      y: 'bottom',
      mode: '',
      // contentData: [],
      selContent: null,
      showModal: false,
      header: '',
      kind: '',
      sortKey: 'created',
      loaded: false
    }
  },
  firebase: {
    contents: contentsRef
  },
  mixins: [notifier, contentFilters],
  mounted () {
    this.content = Object.assign(
      {},
      (this.contents.filter((content) => {
        return (content['.key'] === this.$route.params.key)
      }))[0]
    )
    this.$bindAsArray('contentData', db.ref('contents/' + this.$route.params.key + '/data'))

    this.loaded = true
  },
  computed: {
    allContents () {
      return this.contentData.length
    },
    savedContent () {
      return this.contentData
        .filter(content => {
          if (content.state === 'saved') {
            return true
          }
        })
    },
    publishedContent () {
      return this.contentData
        .filter(content => {
          if (content.state === 'published') {
            return true
          }
        })
    }
  },
  methods: {
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
    toggleOrder () {
      this.pagination.descending = !this.pagination.descending
    },
    nextSort () {
      let index = this.headers.findIndex(h => h.value === this.pagination.sortBy)
      index = (index + 1) % this.headers.length
      index = index === 0 ? index + 1 : index
      this.pagination.sortBy = this.headers[index].value
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    findField (field) {
      for (var key in this.content.fields) {
        if (this.content.fields[key].name.toLowerCase() === field) {
          if (this.content.fields[key].sortable) {
            return true
          }
        }
      }
      return false
    },
    formatDate (epoch) {
      if (!epoch) return // if no time return nothing
      return moment(epoch).format('MM/DD/YY | hh:mm')
    },
    addContent (content) {
      this.$firebaseRefs.contents.child(this.$route.params.key + '/data')
        .push(content)
        .then(() => {
          this.showNotification('success', 'Content added successfully')
        })
    },
    deleteContent (content) {
      // delete content form firebase
      this.header = 'Are you sure you want to delete this content?'
      this.kind = 'deleteContent'
      this.showModal = true
      this.selContent = content
    },
    bulkDelete () {
      if (this.selectedContent.length) {
        this.header = 'Are you sure you want to delete selected contents?'
        this.kind = 'bulkDeleteSelected'
        this.showModal = true
      }
    },
    confirmDeleteContent () {
      this.$firebaseRefs.contents.child(this.$route.params.key + '/data').child(this.selContent['.key']).remove()
        .then(() => {
          this.showNotification('success', 'Content deleted successfully')
          this.showModal = false
          this.selContent = ''
        })
    },
    updateContent (content) {
      // console.log(JSON.stringify(content), content)
      // create a copy of the item
      let tempCon = { ...content }
      // remove the .key attribute
      delete tempCon['.key']
      this.$firebaseRefs.contents.child(this.$route.params.key + '/data').child(content['.key']).set(tempCon)
        .then(() => {
          if (content.state === 'saved') {
            this.showNotification('success', 'Content updated successfully')
          }
          if (content.state === 'published') {
            this.showNotification('success', 'Content updated and published successfully')
          }
        })
    }
  },
  components: {
    modal,
    dropdown,
    checkbox
  }
}

</script>

<style lang="scss">
.avatar {color: white}
#posts {
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
}
th {
  cursor: pointer
}
.icon-centered {
    display: block !important;
    width: 100% !important;
    text-align: center !important;
}
.filters {
  padding-bottom: 5px;
  padding-top: 15px;
}
.activeState {
  color: rgb(0, 0, 0) !important;
}
</style>
