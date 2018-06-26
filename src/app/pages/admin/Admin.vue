<template>
  <v-app light class="admin bulma" id="admin">
    <!-- The admin page layout -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      clipped
      app
    >
      <v-list dense>
        <v-list-group
          prepend-icon="find_in_page"
          value="false"
          v-model="ddown"
        >
          <v-list-tile slot="activator" v-for="menuItem in menuItems" :key="menuItem.index">
            <v-list-tile-title>{{ menuItem.name }}</v-list-tile-title>
          </v-list-tile>
          <router-link v-for="(dropdownItem, dropdownItemKey) in contents" :key="dropdownItemKey" :to="'/admin/content/' + dropdownItem['.key']" exact tag="v-list-tile">
            <v-list-tile-action>
              <v-icon>list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              {{ dropdownItem.name }}
            </v-list-tile-content>
          </router-link>
          <router-link :to="menuItems[0].dropdown[0].path" tag="v-list-tile" exact>
            <v-list-tile-action>
              <v-icon>{{ menuItems[0].dropdown[0].icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              {{ menuItems[0].dropdown[0].name }}
            </v-list-tile-content>
          </router-link>
        </v-list-group>
      </v-list>
      <v-list dense>
        <router-link v-for="(item, index) in menu" :to="item.path" :key="index" tag="v-list-tile" exact>
          <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="white" fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-if="loadLogo"><figure class="websiteLogo">
        <a href="/admin"><img :src="loadLogo" alt="image"></a>
      </figure></v-toolbar-title>
      <v-toolbar-title v-else>
        <div class="loading">
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
          <div class="loading-bar"></div>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn class="hidden-sm-and-down" flat color="primary">{{currentUser.email}}</v-btn>
        <v-tooltip bottom>
          <v-btn slot="activator" flat color="primary" href="/" target="_blank"><v-icon>open_in_new</v-icon></v-btn>
          <span>View site</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-btn flat slot="activator" @click="signOut"><v-icon>cloud_off</v-icon></v-btn>
          <span>Sign Out</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <!-- modal for logout -->
        <transition mode="out-in" name="fade">
          <modal @close="showModal = false" :kind="kind" @confirmLogout='confirmLogout()' v-if="showModal" :header="header"/>
        </transition>
      <v-container v-if="$route.name === 'Admin'">
        <v-layout
          wrap
          align-center
        >
          <v-flex xs12 class="my-3">
            <div class="text-xs-center">
                <div class="titleAdmin">
                  <h1 class="headline">
                    <v-icon left>dashboard</v-icon> Dashboard
                  </h1>
                </div>
                <h2 class="subtitle">
                  <span style="font-size: 25px;font-weight: bold">FoxyJot</span>
                </h2>
                <router-link :to="{ name: 'Home'}">
                  <!-- <img src="/static/img/qikbyte-logo.png" alt="Qikbyte logo"> -->
                  <div>
                    <object type="image/png" data="/static/img/foxyjot-logo.png" class="flogo" style="pointer-events: none;"></object>
                  </div>
                </router-link>
                <p>Version v0.0.1</p>
              </div>
          </v-flex>
        </v-layout>
      </v-container>
      <router-view :key="$route.path" />
    </v-content>
    <v-footer class="primary darken-1 pa-3">
      <v-spacer></v-spacer>
      <div class="white--text">&copy; {{ new Date().getFullYear() }} - <b>FoxyJot</b></div>
    </v-footer>
  </v-app>
</template>

<script>
import Database from '@/app/pages/admin/Database'
import { auth, contentsRef, mediaRef } from '@/app/firebase_config'
import modal from '@/app/components/shared/Modal'

export default {
  name: 'admin',
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | Admin'
  },
  firebase: {
    contents: contentsRef,
    media: {
      source: mediaRef
    }
  },
  data () {
    return {
      loaded: true,
      drawer: false,
      ddown: false,
      currentUser: auth.currentUser,
      showModal: false,
      header: 'Are you sure you want to logout?',
      kind: 'logout',
      menu: [
        {
          name: 'Routing',
          path: '/admin/routing',
          icon: 'swap_horiz'
        },
        {
          name: 'Media Library',
          path: '/admin/media',
          icon: 'collections'
        },
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: 'settings'
        }
      ]
    }
  },
  methods: {
    signOut () {
      this.showModal = true
    },
    confirmLogout () {
      this.$store.dispatch('userSignOut')
    }
  },
  computed: {
    menuItems () {
      return this.$store.getters.menuItems
    },
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
  components: {
    modal,
    'database': Database
  }
}

</script>

<style lang="sass">
@import './styles/index'
.flogo
  width: 100%
  max-width: 100px
.websiteLogo img
  width: 100%
  max-width: 25px
  margin-top: 0.9rem
</style>
