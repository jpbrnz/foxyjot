<template>
  <v-app light class="home">
    <v-navigation-drawer
      v-model="drawer"
      temporary
      clipped
      app
    >
      <v-list dense>
        <router-link v-for="(ref, index) in nav" :key="index" :to="ref.path" tag="v-list-tile" v-if="!ref.children">
          <v-list-tile-action>
            <v-icon>launch</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ref.name}}</v-list-tile-title>
          </v-list-tile-content>
        </router-link>
        <v-list-group v-model="ddown" prepend-icon="list" no-action value="false" v-for="(link, index) in nav" :key="index" v-if="link.children">
          <v-list-tile slot="activator">
            <v-list-tile-title>{{link.name}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for="(subLink, index) in link.children" :key="index" :to="subLink.path">
            <v-list-tile-action>
              <v-icon>launch</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-text="subLink.name"></v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="white" fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><figure class="websiteLogo" v-if="loadLogo">
        <router-link :to="'/'"><img :src="loadLogo" alt="image"></router-link>
      </figure></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat href="/admin"><v-icon>dashboard</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <section>
      </section>
      <section>
        <v-container>
          <v-layout
            column
            wrap
            class="my-5"
            align-center
          >
            <v-flex xs12 class="my-3">
              <div>
                <h1>Garage Dev Fun! (Demo template route)</h1>
                <p>FoxyJot is a designed to be a simple to use content repository and lead generation tool. Providing users with the ability to create content types, upload and write content and media, while also providing a easy to use templating system for elegant display of content and media items.</p>
                <p>FoxyJot was created on a quick journey into Vue, Vuetify and Firebase. What started as a simple authentication app turned into a full feature landing page builder and content repository. As we uncover more fun resources and components this project will continue to evolve. Much of this project is a collection of the community busy making these frameworks incredible.</p>
                <br><hr><br>
                <p>Currently this project is made up of two weekends and some time between work, dad duty, and life. As time permits we will see if some additional features and bug herding can be done.
                <p>There are a ton of todo items for this project. Really is just a spark or start to a full featured CMS for small to medium size businesses. Event planners, bands, teachers, specialy shops, you name it.</p>
                <p>This is an experimental project and you should proceed with caution if you intend to use this in any production environment.</p>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </section>
    </v-content>
    <v-footer class="primary darken-1 pa-3">
      <v-spacer></v-spacer>
      <div class="white--text">&copy; {{ new Date().getFullYear() }} - <b>FoxyJot</b></div>
      <!-- &copy; foxyjot.com -->
    </v-footer>
  </v-app>
</template>

<script>
import { settingsRef, navRef, mediaRef } from '@/app/firebase_config'

export default {
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | About Us'
  },
  firebase: {
    // load settings as object instead of array (default)
    settings: {
      source: settingsRef,
      asObject: true
    },
    nav: {
      source: navRef
    },
    media: {
      source: mediaRef
    }
  },
  computed: {
    loadLogo () {
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
  data () {
    return {
      ddown: false,
      drawer: false
    }
  }
}
</script>
<style lang="sass">
@import '../styles/index.sass'
</style>
