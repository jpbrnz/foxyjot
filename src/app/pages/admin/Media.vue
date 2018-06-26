<template>
  <v-container grid-list-lg>
    <h2 class="mb-5">Media Library</h2>
    <div v-if="!media.hasOwnProperty('.value')">
      <v-layout row wrap>
        <v-flex sm12 md4 class="hidden-sm-and-down">
          <v-carousel light hide-delimiters>
            <v-carousel-item
              v-for="(img, key) in images"
              :key="key"
              v-if="img.src && img.path"
              :src="img.src"
              transition="fade"
              reverse-transition="fade"
            ></v-carousel-item>
          </v-carousel>
        </v-flex>
        <v-flex sm12 md8>
          <v-layout row wrap>
            <v-flex xs12 sm6 md4 v-for="(img, key) in images" :key="key" v-if="img.src && img.path">
              <v-card>
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs5>
                      <div>
                        {{img.name}}
                        <v-tooltip bottom color="error">
                          <v-btn slot="activator" flat icon @click="deleteImage(img.path, key)" class="delete delete-button error--text"><v-icon>block</v-icon></v-btn>
                          <span>Delete</span>
                        </v-tooltip>
                      </div>
                    </v-flex>
                    <v-flex xs7>
                      <a :href="img.src" target="_blank">
                        <v-tooltip bottom>
                          <v-card-media
                            slot="activator"
                            :src="img.src"
                            height="125px"
                            contain
                          ></v-card-media>
                          <span>Open New Tab</span>
                        </v-tooltip>
                      </a>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
  <!-- &copy; foxyjot.com -->
</template>

<script>
import { stor, mediaRef } from '@/app/firebase_config'

export default {
  name: 'Media',
  data: function () {
    return {
    }
  },
  firebase: {
    // load settings as an object instead of array (default)
    media: {
      source: mediaRef,
      asObject: true
    }
  },
  computed: {
    images () {
      return this.media
    }
  },
  methods: {
    deleteImage (path, key) {
      let storageRef = stor.ref(path)
      var that = this
      storageRef.delete().then(function () {
        that.$firebaseRefs.media.child(key).remove()
      }).catch(function (error) {
        console.error(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active,
.fade-leave-to {
  transition: 0.3s ease-out;
  position: absolute;
  top: 0;
  left: 0;
}
.fade-enter,
.fade-leave,
.fade-leave-to {
  opacity: 0;
}
.img-container {
  margin: 10px;
  position: relative;
  background-color: white;
  width: 200px;
  height: 200px;
  .delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .info-tab {
    position: absolute;
    bottom: 0px;
    height: 28px;
    width: 100%;
    padding: 4px;
    background-color: black;
    color: white;
    opacity: 0.71;
  }
}

.image-div {
  height: 100%;
  width: 100%;
  background-size: cover;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  // align-content: flex-start;
  align-items: flex-start;
}

.gallery a {
  flex-grow: 1;
  margin: 5px;
}
</style>
