<template>
  <!-- navigation menu builder -->
  <v-layout row wrap class="nav-builder mt-3">
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="grey lighten-5">
          <span class="headline">Navigation Menu Builder</span>
        </v-card-title>
        <v-card-text>
          <div class="field">
            <div class="control">
              <v-text-field
              v-model="name"
              label="Name"
              required
            ></v-text-field>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <v-text-field
              v-model="path"
              label="Path (e.g. /admin/posts)"
              required
            ></v-text-field>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <v-btn v-if="action === 'new'" color="primary" class="button is-info" @click="addLink">Add</v-btn>
              <v-btn v-if="action === 'edit'" color="warning" class="button is-info" @click="updateLink">
                Update
              </v-btn>
              <v-btn v-if="action === 'new-sub'" color="primary" class="button is-info" @click="appendSubLink">
                Add sub-link
              </v-btn>
              <v-btn v-if="action === 'edit-sub'" color="warning" class="button is-info" @click="updateSubLink">
                Edit sub-link
              </v-btn>
              <v-btn @click="clear">Cancel</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="grey lighten-5">
          <span class="headline">Menu</span>
        </v-card-title>
        <v-card-text>
        <!-- menu visualization -->
          <ul v-for="(item, index) in menu" :key="index" class="nav-preview">
            <li>
              {{item.name}}: {{item.path}}

              <span class="link-actions">
                <v-icon @click="removeLink(item)">delete</v-icon>
                <v-icon v-if="index !== 0" @click="moveLinkUp(item, menu[index - 1])">arrow_upward</v-icon>
                <v-icon v-if="index !== menu.length - 1" @click="moveLinkDown(item, menu[index + 1])">arrow_downward</v-icon>
                <v-icon @click="editLink(item)">edit</v-icon>
                <v-icon @click="addSubLink(item)">add</v-icon>
              </span>

              <!-- render children links -->
              <ul v-if="item.children" class="sub-nav-preview">
                <li v-for="(child, key) in item.children" :key="key">
                  {{child.name}}: {{child.path}}

                  <span class="sub-link-actions">
                    <v-icon @click="removeSubLink(key, item)">delete</v-icon>
                    <v-icon @click="moveSubLinkUp(key, item)">arrow_upward</v-icon>
                    <v-icon @click="moveSubLinkDown(key, item)">arrow_downward</v-icon>
                    <v-icon @click="editSubLink(key, item)">edit</v-icon>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { settingsRef, navRef } from '@/app/firebase_config'
export default {
  data () {
    return {
      key: '',
      link: '', // {'.key', name, path}
      name: '',
      path: '',
      action: 'new'
    }
  },
  computed: {
    isAbsolute () {
      return this.path.startsWith('http')
    }
  },
  firebase: {
    settings: {
      source: settingsRef,
      asObject: true
    },
    menu: {
      source: navRef
    }
  },
  methods: {
    addLink () {
      if (this.name && this.path) {
        this.$firebaseRefs.menu.push({
          name: this.name,
          path: this.path,
          isAbsolute: this.isAbsolute
        })
      }
      this.clear()
    },
    editLink (link) {
      this.name = link.name
      this.path = link.path
      this.action = 'edit'
      this.key = link['.key']
      this.link = Object.assign({}, link)
    },
    updateLink () {
      delete this.link['.key']
      this.link.name = this.name
      this.link.path = this.path
      this.link.isAbsolute = this.isAbsolute

      this.$firebaseRefs.menu.child(this.key).set(this.link)
      this.clear()
    },
    removeLink (item) {
      this.$firebaseRefs.menu.child(item['.key']).remove()
    },
    clear () {
      this.name = ''
      this.path = ''
      this.action = 'new'
    },
    moveLinkUp (item, previousItem) {
      let itemCopy = Object.assign({}, item)
      let previousItemCopy = Object.assign({}, previousItem)

      delete itemCopy['.key']
      delete previousItemCopy['.key']

      this.$firebaseRefs.menu.child(item['.key']).set(previousItemCopy)
      this.$firebaseRefs.menu.child(previousItem['.key']).set(itemCopy)
    },
    moveLinkDown (item, nextItem) {
      let itemCopy = Object.assign({}, item)
      let nextItemCopy = Object.assign({}, nextItem)

      delete itemCopy['.key']
      delete nextItemCopy['.key']

      this.$firebaseRefs.menu.child(item['.key']).set(nextItemCopy)
      this.$firebaseRefs.menu.child(nextItem['.key']).set(itemCopy)
    },
    addSubLink (link) {
      this.action = 'new-sub'
      this.key = link['.key']
    },
    appendSubLink () {
      this.$firebaseRefs.menu.child(this.key).child('children').push({
        name: this.name,
        path: this.path,
        isAbsolute: this.isAbsolute
      })
      this.clear()
    },
    moveSubLinkUp (currentKey, parent) {
      let childrenObject = {}
      let childrenArray = this.convertFirebaseObjToArray(parent.children)
      let previousKey = ''

      for (let i = 0; i < childrenArray.length; i++) {
        if (childrenArray[i]['.key'] === currentKey) {
          previousKey = childrenArray[i - 1]['.key']

          childrenObject[previousKey] = {...childrenArray[i]}
          childrenObject[currentKey] = {...childrenArray[i - 1]}

          delete childrenObject[previousKey]['.key']
          delete childrenObject[currentKey]['.key']
        } else {
          childrenObject[childrenArray[i]['.key']] = {...childrenArray[i]}
          delete childrenObject[childrenArray[i]['.key']]['.key']
        }
      }

      this.$firebaseRefs.menu.child(parent['.key']).child('children').set(childrenObject)
    },
    moveSubLinkDown (currentKey, parent) {
      let childrenObject = {}
      let childrenArray = this.convertFirebaseObjToArray(parent.children)
      let nextKey = ''

      for (let i = childrenArray.length - 1; i >= 0; i--) {
        if (childrenArray[i]['.key'] === currentKey) {
          nextKey = childrenArray[i + 1]['.key']

          childrenObject[nextKey] = {...childrenArray[i]}
          childrenObject[currentKey] = {...childrenArray[i + 1]}

          delete childrenObject[nextKey]['.key']
          delete childrenObject[currentKey]['.key']
        } else {
          childrenObject[childrenArray[i]['.key']] = {...childrenArray[i]}
          delete childrenObject[childrenArray[i]['.key']]['.key']
        }
      }

      this.$firebaseRefs.menu.child(parent['.key']).child('children').set(childrenObject)
    },
    convertFirebaseObjToArray (obj) {
      let array = []
      for (let key in obj) {
        array.push({'.key': key, ...obj[key]})
      }
      return array
    },
    removeSubLink (key, parent) {
      this.$firebaseRefs.menu.child(parent['.key']).child('children').child(key).remove()
    },
    editSubLink (key, parent) {
      this.name = parent.children[key].name
      this.path = parent.children[key].path
      this.action = 'edit-sub'
      this.key = key
      this.link = Object.assign({}, parent)
      console.log(this.link['.key'])
    },
    updateSubLink () {
      this.$firebaseRefs.menu.child(this.link['.key']).child('children').child(this.key).update({
        name: this.name,
        path: this.path,
        isAbsolute: this.isAbsolute
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
.nav-builder {

  .link-actions, .sub-link-actions {
    display: none;
    .icon {
      font-size: 18px;
      cursor: pointer;
    }
  }

  .nav-preview>li:hover .link-actions {
    display: inline;
    font-size: 1rem;
    line-height: 1.5;
  }

  .sub-nav-preview>li:hover .sub-link-actions {
    display: inline;
  }

  .sub-nav-preview>li:first-child {
    .fa-arrow-up {
      display: none;
    }
  }

  .sub-nav-preview>li:last-child {
    .fa-arrow-down {
      display: none;
    }
  }
}
</style>
