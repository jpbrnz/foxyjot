<template>
  <v-container id="settings" grid-list-lg class="mt-5">
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
    <!-- modal for add setting -->
    <transition mode="out-in" name="fade">
      <modal @close="showModal = false" :kind="kind" @addSetting='confirmAddSetting' @confirmDeleteSetting="confirmDeleteSetting()" v-if="showModal" :header="header"/>
    </transition>
    <v-card>
      <v-card-title class="primary white--text">
        <span class="headline">General settings</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <h3>Website Logo</h3>
              <div class="field">
                <div class="control">
                  <div class="field">
                    <div class="control">
                      <img :src="displayLogo" style="width: 100px;">
                      <div class="file">
                        <label class="file-label">
                          <input @change="uploadWebsiteLogo" class="file-input" type="file" name="resume">
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
                  </div>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 sm8>
              <h3>Settings</h3>
              <div class="is-multiline">
                <div v-for="(field, key) in settings" class="field" :key="key" v-if="key !== '.key'">
                  <v-text-field
                    :name="field"
                    :label="key"
                    v-model="settings[key]"
                    required
                  ></v-text-field>
                </div>
                <!-- Main container -->
                <nav class="level">
                  <!-- Left side -->
                  <div class="level-left">
                    <!--<div class="level-item"></div>-->
                  </div>
                  <!-- Right side -->
                  <div class="text-xs-left">
                      <v-btn color="primary" type="button" @click="addSettingField">
                        Add Settings field
                      </v-btn>
                      <v-btn color="primary" type="button" @click="saveSettings">
                        Save Settings
                      </v-btn>
                  </div>
                </nav>
              </div>
            </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
      <database></database>
    </v-container>
</template>

<script>
import Database from '@/app/pages/admin/Database'
import { stor, mediaRef, settingsRef } from '@/app/firebase_config'
import notifier from '@/app/mixins/notifier'
import modal from '@/app/components/shared/Modal'
import imageLoader from '@/app/mixins/image-loader'
export default {
  name: 'settings',
  data () {
    return {
      updatesCounter: 0,
      // this array contains settings form fields
      fields: [
        {
          label: 'Site Title',
          name: 'title',
          value: ''
        },
        {
          label: 'Site Description',
          name: 'description',
          value: ''
        }
      ],
      showModal: false,
      header: '',
      kind: '',
      deleteKey: '',
      websiteLogo: '',
      snackbar: false,
      y: 'bottom',
      mode: ''
    }
  },
  firebase: {
    // load settings as an object instead of array (default)
    settings: {
      source: settingsRef,
      asObject: true
    },
    media: mediaRef
  },
  mixins: [notifier, imageLoader],
  computed: {
    displayLogo () {
      var i = this.media.length
      var url = null
      while (i--) {
        if (this.media[i].name === 'WebsiteLogo') {
          url = this.media[i].src
        }
      }
      return url
    }
  },
  methods: {
    saveSettings () {
      delete this.settings['.key'] // This is a bit weird but no problem
      this.$firebaseRefs.settings.update(this.settings).then(() => {
        this.showNotification('success', 'Settings Successfully saved')
      })
    },
    // display the loaded settings
    displaySettings () {
      for (let key in this.settings) {
        this.fields.map((field) => {
          if (field.name === key) {
            field.value = this.settings[key]
            return this.settings[key]
          }
        })
      }
    },
    addSettingField () {
      this.header = 'Add a new setting: '
      this.kind = 'addSetting'
      this.showModal = true
    },
    confirmAddSetting (value) {
      if (value === '') {
        this.showNotification('danger', 'Please input the name of the setting first')
        return
      }
      if (this.settings.hasOwnProperty(value)) {
        this.showNotification('danger', 'This setting already exists')
        return
      }

      this.$firebaseRefs.settings.update({
        [value]: ''
      }).then(() => {
        this.showNotification('success', 'Setting successfully added')
        this.showModal = false
      }).catch(() => {
        this.showNotification('error', 'Setting not added')
      })
    },
    deleteSettingsField (key) {
      this.header = 'Are you sure you want to delete this setting?'
      this.kind = 'deleteSetting'
      this.showModal = true
      this.deleteKey = key
    },
    confirmDeleteSetting () {
      this.$firebaseRefs.settings
        .child(this.deleteKey)
        .remove()
        .then(() => {
          this.showNotification('success', 'Setting successfully removed')
          this.showModal = false
          this.deleteKey = ''
          this.kind = ''
        })
        .catch((e) => {
          this.showNotification('error', 'Setting not removed')
        })
    },
    uploadWebsiteLogo (e) {
      console.log(e)
      let file = e.target.files[0]
      let storageRef = stor.ref('images/' + file.name)

      var i = this.media.length
      var currentLogo = null
      while (i--) {
        if (this.media[i].name === 'WebsiteLogo') {
          currentLogo = this.media[i]
        }
      }
      storageRef.put(file).then((snapshot) => {
        console.log(snapshot)
        this.websiteLogo = snapshot.downloadURL

        var logo = {
          src: snapshot.downloadURL,
          path: snapshot.ref.fullPath,
          name: 'WebsiteLogo'
        }
        // let tempLogo = {...currentLogo}

        if (currentLogo) {
          // delete tempLogo[key]
          this.$firebaseRefs.media.child(currentLogo['.key']).set(logo)
            .then(() => {
              this.showNotification('success', 'Logo uploaded successfully')
            })
        } else {
          if (Object.values(this.media).find(e => e.path === snapshot.ref.fullPath)) return
          this.$firebaseRefs.media.push({
            src: snapshot.downloadURL,
            path: snapshot.ref.fullPath,
            name: 'WebsiteLogo'
          }).then(() => {
            this.showNotification('success', 'Logo uploaded successfully')
          })
        }
      })
    }
  },
  updated () {
    // run the loaded settings once
    if (this.updatesCounter === 0) {
      this.displaySettings()
    }
    this.updatesCounter++
  },
  components: {
    modal,
    'database': Database
  }
}

</script>
<style>
.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
