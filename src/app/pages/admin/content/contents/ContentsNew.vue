<template>
  <v-layout>
    <v-container grid-list-lg class="mt-5">
      <v-layout row wrap>
        <v-flex xs12 sm7>
          <!-- Textbox fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'textbox'">
            <v-text-field
              :name="field.name"
              :label="field.name.charAt(0).toUpperCase() + field.name.slice(1)"
              v-model="newContent[field.name]"
              required
            ></v-text-field>
          </div>

          <!-- Textarea fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'textarea'">
            <v-text-field
                v-model="newContent[field.name]"
                v-text="newContent[field.name]"
                :label="field.name.charAt(0).toUpperCase() + field.name.slice(1)"
                textarea
              ></v-text-field>
          </div>

          <!-- Rich text fields - vue-quill-editor plugin -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'richtextbox'">
            <quill-editor v-model="newContent[field.name]" :options="editorOptions">
            </quill-editor>
            <input type="file" id="getImage" style="display: none;" @change="uploadImage">
          </div>

          <!-- Category fields -->
          <br>
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'select'">
            <v-text-field
              :name="field.name"
              :label="field.name.charAt(0).toUpperCase() + field.name.slice(1)"
              v-model="newContent[field.name]"
              required
            ></v-text-field>
          </div>
        </v-flex>
        <v-flex xs12 sm4 offset-sm1>
          <!-- Tag fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'tags'">
            <div class="control">
              <div class="tags tagscontainer">
              <span @click="removeTag(tagKey, field.name)" v-for="(tag, tagKey) in newContent[field.name]" :key="tagKey" class="tag is-info pointer">{{tag}}<button class="delete is-small"></button></span>
              <v-text-field
                :label="field.name.charAt(0).toUpperCase() + field.name.slice(1)"
                v-model="inputData"
                @keyup.enter="styleTags(field.name)"
              ></v-text-field>
              </div>
              <p>Seperate tags with commas</p>
            </div>
          </div>

          <!-- Image fields -->
          <div v-for="(field, index) in fields" :key="index" v-if="field.type === 'image'">
            <label class="label">Featured Image</label>
            <div class="control">
              <img :src="newContent[field.name]">
              <div class="file">
                <label class="file-label">
                  <input @change="uploadFeaturedImage($event, field.name)" class="file-input" type="file" name="resume">
                  <span class="file-cta">
                    <span class="file-icon">
                      <v-icon>cloud_upload</v-icon>
                    </span>
                    <span class="file-label">
                      Choose a file…
                    </span>
                  </span>
                </label>
              </div>
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
          <v-btn type="submit" color="primary" @click="add('published')">Publish</v-btn>
          <v-btn type="submit" color="warning" @click="add('saved')">Save Draft</v-btn>
          <router-link :to="'/admin/content/' + $route.params.key" color="error" tag="v-btn">Cancel</router-link>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import { stor, mediaRef } from '@/app/firebase_config'
import editorOptions from '@/app/utils/editor-options'
import imageLoader from '@/app/mixins/image-loader'
import notifier from '@/app/mixins/notifier'

export default {
  name: 'content-new',
  firebase: {
    media: mediaRef
  },
  props: ['add-content', 'fields'],
  mixins: [imageLoader, notifier],
  data () {
    return {
      snackbar: false,
      y: 'bottom',
      mode: '',
      newContent: {},
      tags: [],
      inputData: '',
      editorOptions
    }
  },
  methods: {
    add (state) {
      console.log('Created new content: ' + this.newContent)
      this.newContent.created = Date.now()
      this.newContent.selected = false
      this.newContent.state = state

      this.addContent(this.newContent)
      this.$router.push({ path: '/admin/content/' + this.$route.params.key })
    },
    uploadFeaturedImage (e, fieldName) {
      console.log(e)
      let file = e.target.files[0]
      let storageRef = stor.ref('images/' + file.name)

      storageRef.put(file).then((snapshot) => {
        console.log(snapshot)
        this.newContent[fieldName] = ''
        this.newContent[fieldName] = snapshot.downloadURL
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
        if (!this.newContent[fieldName]) {
          this.newContent[fieldName] = []
        }
        this.newContent[fieldName].push(`${this.inputData.trim()}`)
        this.inputData = ''
      }
    },
    removeTag (index, fieldName) {
      this.newContent[fieldName].splice(index, 1)
    }
  }
}

</script>

<style>
.tagscontainer {
  border: 2px solid #f2f2f2;
  border-radius: 5px;
  padding: 5px;
}
.pointer {
  cursor: pointer;
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
