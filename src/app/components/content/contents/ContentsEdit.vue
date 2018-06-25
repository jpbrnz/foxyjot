<template>
  <v-layout>
    <v-container grid-list-lg class="mt-5">
      <v-layout row wrap>
        <v-flex xs12 sm7>
          <!-- Textbox fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'textbox'">
            <v-text-field
              :name="field"
              :label="field.name"
              v-model="content[field.name]"
              required
            ></v-text-field>
          </div>

          <!-- Textarea fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'textarea'">
            <v-text-field
              v-model="content[field.name]"
              v-text="content[field.name]"
              :label="field.name"
              textarea
              ></v-text-field>
          </div>

          <!-- Rich text fields - vue-quill-editor plugin -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'richtextbox'">
            <quill-editor v-model="content[field.name]" :options="editorOptions">
            </quill-editor>
            <input type="file" id="getImage" style="display: none;" @change="uploadImage">
          </div>

          <!-- Category fields -->
          <br>
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'select'">
            <v-text-field
              :name="field.name"
              :label="field.name"
              v-model="content[field.name]"
              required
            ></v-text-field>
          </div>
        </v-flex>
        <v-flex xs12 sm4 offset-sm1>
          <!-- Tag fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'tags'">
            <div class="tags tagscontainer">
              <v-chip close @click="removeTag(tagKey, field.name)" v-for="(tag, tagKey) in content[field.name]" :key="tagKey">{{tag}}</v-chip>
              <v-text-field
                :label="field.name"
                v-model="inputData"
                @keyup.enter="styleTags(field.name)"
                required
              ></v-text-field>
              </div>
              <p>Seperate tags with commas</p>
          </div>

          <!-- Image fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'image'">
            <label class="label">Featured Image</label>
            <img :src="content[field.name]" class="img-preview">
            <div class="file">
              <label class="file-label">
                <input @change="uploadFeaturedImage($event, field.name)" class="file-input" type="file" name="resume">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fa fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a file…
                  </span>
                </span>
              </label>
            </div>
          </div>
        </v-flex>
        <v-flex>
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
           <!-- the form buttons -->
          <v-btn v-if="content.state === 'saved'" type="submit" color="primary" @click="update(true)">Update and publish</v-btn>
          <v-btn type="submit" color="primary" @click="update(false)">Update</v-btn>
          <router-link :to="'/admin/content/' + $route.params.key" tag="v-btn">Cancel</router-link>
        </v-flex>
        <v-flex xs12>
          <v-divider class="mt-3"></v-divider>
          <v-list two-line subheader class="mt-3">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Content Routes:</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(route, i) in routes" :key="i" v-if="content['.key'] === route.content" >
              <v-list-tile-content>
                <v-list-tile-title>Path: <a :href="route.path" target="_blank">{{route.path}}</a></v-list-tile-title>
                  <v-list-tile-sub-title>
                    <div class="route-details">
                      <span><b>Template:</b> {{getTemplateDisplayName(route.template)}}</span>
                    </div>
                  </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <router-link flat small :to="{ name: 'Routing' }" slot="activator" href="admin/routing" class="primary--text" tag="v-btn">Add New Route  <v-icon right>library_add</v-icon></router-link>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import firebase from 'firebase'
import { mediaRef, routesRef } from '@/app/firebase_config'
import editorOptions from '@/app/utils/editor-options'
import imageLoader from '@/app/mixins/image-loader'
import notifier from '@/app/mixins/notifier'
import templates from '@/app/templates/templates.json'

export default {
  name: 'content-edit',
  data () {
    return {
      /* Here we are filtering out the post containing the provided key in the router params
       * we are using Object.assign to copy the post by value not by reference
       * to prevent updating the poste when typing */
      inputData: '',
      snackbar: false,
      y: 'bottom',
      mode: '',
      content: Object.assign(
        {},
        (this.contents.filter((c) => {
          return (c['.key'] === this.$route.params.contentKey)
        }))[0]
      ),
      editorOptions,
      templates
    }
  },
  firebase: {
    media: mediaRef,
    routes: routesRef
  },
  props: ['contents', 'update-content', 'fields'],
  mixins: [imageLoader, notifier],
  methods: {
    update (publish) {
      if (publish) {
        this.content.state = 'published'
      }
      this.updateContent(this.content)
    },
    uploadFeaturedImage (e) {
      let file = e.target.files[0]
      let storageRef = firebase.storage().ref('images/' + file.name)

      storageRef.put(file).then((snapshot) => {
        this.content.img = snapshot.downloadURL
        if (Object.values(this.media).find(e => e.path === snapshot.ref.fullPath)) return // this prevents duplicate entries in the media object
        this.$firebaseRefs.media.push({
          src: snapshot.downloadURL,
          path: snapshot.ref.fullPath,
          name: snapshot.metadata.name
        })
      })
    },
    styleTags (fieldName) {
      if (this.inputData !== '') {
        if (!this.content[fieldName]) {
          this.content[fieldName] = []
        }
        this.content[fieldName].push(`${this.inputData.trim()}`)
        this.inputData = ''
      }
    },
    removeTag (index, fieldName) {
      this.content[fieldName].splice(index, 1)
    },
    selectContentByTypeAndId (type, id) {
      let contentsByType = this.getContentsByType(type)
      return contentsByType.filter(content => content['.key'] === id)[0] || {}
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
  }
}

</script>
<style>
.tagscontainer {
  border: 2px solid #f2f2f2;
  border-radius: 2px;
  padding: 5px;
}
.pointer {
  cursor: pointer;
}
.img-preview {
  width:100%;
}
.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
