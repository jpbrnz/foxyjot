<template>
  <v-container>
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
    <v-expansion-panel>
      <v-expansion-panel-content value="Database State" v-model="dbstate">
        <div slot="header" class="headline">Database State</div>
        <v-card>
          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-layout row wrap justify-center>
                <v-flex xs12 sm6 md4>
                  <v-card class="elevation-2">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs12 class="text-xs-left">
                          <div>
                            <span class="headline"><v-icon>settings</v-icon> Settings:</span><br/>
                            <span v-if="settings.length === 0" class="has-text-danger">
                              Empty
                              <v-btn small color="primary" @click="addDemoSettings">Add Settings</v-btn>
                            </span>
                            <span v-else class="primary--text">
                              <v-switch label="Active" value input-value="true" ></v-switch></span>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-card class="elevation-2">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs12 class="text-xs-left">
                          <div>
                            <span class="headline"><v-icon>perm_media</v-icon> Media:</span><br/>
                            <span v-if="media.length === 0" class="has-text-danger">
                              Empty <v-btn small color="primary" @click="addDemoLogo">Add Logo</v-btn>
                            </span>
                            <span v-else class="primary--text text-xs-left">
                              <v-switch label="Active" value input-value="true" ></v-switch>
                            </span>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-card class="elevation-2">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs12 class="text-xs-left">
                          <div>
                            <span class="headline"><v-icon>more_horiz</v-icon> Nav:</span><br/>
                            <span v-if="nav.length === 0" class="has-text-danger">
                              Empty <v-btn small color="primary" @click="addDemoNav">Add Nav</v-btn>
                            </span>
                            <span v-else class="primary--text">
                            <v-switch label="Active" value input-value="true" ></v-switch></span>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-card class="elevation-2">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs12 class="text-xs-left">
                          <div>
                            <span class="headline"><v-icon>folder</v-icon> Content:</span><br/>
                            <span v-if="contents.length === 0" class="has-text-danger">
                              Empty
                              <v-btn small color="primary" @click="addDemoContent">Add Content</v-btn>
                            </span>
                            <span v-else class="primary--text">
                            <v-switch label="Active" value input-value="true" ></v-switch></span>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-card class="elevation-2">
                    <v-container fluid grid-list-lg>
                      <v-layout row>
                        <v-flex xs12 class="text-xs-left">
                          <div>
                            <span class="headline"><v-icon>table_chart</v-icon> Fields:</span><br/>
                            <span v-if="fields.length === 0" class="has-text-danger">
                              Empty
                              <v-btn small color="primary" @click="addDemoFields">Add Fields</v-btn>
                            </span>
                            <span v-else class="primary--text">
                            <v-switch label="Active" value input-value="true" ></v-switch></span>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import {demoData} from '@/../foxyjot.config.json'
import notifier from '@/app/mixins/notifier'
import { settingsRef, mediaRef, navRef, contentsRef, fieldsRef } from '@/app/firebase_config'
export default {
  data () {
    return {...demoData, con: '', interval: {}, value: 0, dbstate: false}
  },
  firebase: {
    settings: settingsRef,
    media: mediaRef,
    nav: navRef,
    fields: fieldsRef,
    contents: contentsRef
  },
  mixins: [notifier],
  methods: {
    addDemoPost () {
      let storageRef = firebase.storage().ref()
      let postImageRef = storageRef.child('images/light-bg.png')
      let imgDownloadURL = ''

      this.fetchLogoBlob()
        .then(blob => {
          return postImageRef.put(blob)
        })
        .then(snapshot => {
          imgDownloadURL = snapshot.downloadURL
          let demoPost = {...this.demoPost}
          demoPost.created = Date.now()
          demoPost.img = imgDownloadURL
          demoPost.body += `<p><img src="${imgDownloadURL}"></p>`
          return this.$firebaseRefs.contents.child(this.con + '/data').push(demoPost)
        })
        .then(() => {
          return this.$firebaseRefs.media.push({
            name: 'light-bg.png',
            path: postImageRef.fullPath,
            src: imgDownloadURL
          })
        })
        .then(() => {
          this.showNotification('success', 'Demo Content added successfully')
        })
    },
    addDemoSettings () {
      this.$firebaseRefs.settings.update(this.demoSettings)
        .then(() => {
          this.showNotification('success', 'Demo Settings added successfully')
        })
    },
    addDemoNav () {
      let i = this.demoNav.length
      this.demoNav.forEach(link => {
        this.$firebaseRefs.nav.push(link)
          .then(() => {
            i--
            if (i === 0) {
              this.showNotification('success', 'Demo Nav added successfully')
            }
          })
      })
    },
    addDemoLogo () {
      let storageRef = firebase.storage().ref()
      let logoRef = storageRef.child(`images/foxyjot-logo.png`)

      this.fetchLogoBlob()
        .then(blob => {
          logoRef
            .put(blob)
            .then(snapshot => {
              this.addDemoLogoToDB(snapshot)
            })
        })
    },
    fetchLogoBlob () {
      return fetch(this.demoLogoLink)
        .then(res => {
          return res.blob()
        })
    },
    addDemoLogoToDB (snapshot) {
      this.$firebaseRefs.media.push({
        name: 'WebsiteLogo',
        path: snapshot.ref.fullPath,
        src: snapshot.downloadURL
      })
        .then(() => {
          this.showNotification('success', 'Demo Logo added successfully')
        })
    },
    addDemoFields () {
      let i = this.demoFields.length
      this.demoFields.forEach(field => {
        this.$firebaseRefs.fields.push(field)
          .then(() => {
            i--
            if (i === 0) {
              this.showNotification('success', 'Demo fields added successfully')
            }
          })
      })
    },
    addDemoContent () {
      this.$firebaseRefs.contents.push(this.demoContent)
        .then((c) => {
          this.con = c.key
          this.addDemoPost()
        })
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
.column > div {
  margin-top: 15px;
  &:first-child {
    margin-top: 0px;
  }
}

button {
  vertical-align: middle !important;
  margin-left: 30px;
}
</style>
