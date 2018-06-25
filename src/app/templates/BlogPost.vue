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
      <v-toolbar-title v-if="loadLogo"><figure class="websiteLogo">
        <a href="/"><img :src="loadLogo" alt="image"></a>
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
        <v-btn flat href="/admin"><v-icon>dashboard</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <section>
        <v-parallax :src="content.img" height="300">
          <v-layout
            column
            align-center
            justify-center
            class="black--text"
          >
            <h1 class="black--text mb-2 display-1 text-xs-center">{{content.title}}</h1>
            <div class="subheading mb-3 text-xs-center">{{content.description}}</div>
            <hr style="width: 40%; height: 2px;" class="my-2 primary">
            <span class="author_date grey--text text--darken-3">
              <v-icon small class="grey--text text--darken-3">
                person_outline
              </v-icon>
              <em>Created by <b>{{content.author}}</b> on <b>{{ formatDate(content.created) }}</b></em>
            </span>
          </v-layout>
        </v-parallax>
      </section>
      <section>
        <v-container>
          <v-layout
            column
            wrap
            class="my-5"
          >
            <v-flex xs12 class="my-3">
              <vueShared></vueShared>
            </v-flex>
            <v-flex xs12 class="mt-1 mb-3">
              <div v-html="content.body"></div>
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
import moment from 'moment'
import LoadContent from './LoadContent'
import vueShared from '@/app/components/social/vueShared'
export default {
  mixins: [LoadContent],
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | Articles'
  },
  data () {
    return {
      ddown: false,
      drawer: false
    }
  },
  methods: {
    formatDate (epoch) {
      if (!epoch) return // if no time return nothing
      return moment(epoch).format('MM/DD/YY')
    }
  },
  components: {
    vueShared
  }
}
</script>

<style lang="sass">
@import '../styles/index.sass'
.author_name
  margin-right: 20px

.author_hold
  position: relative
  margin: 0
  padding: 0
  width: 100%

.author
  position: absolute
  right: 50px
  top: -80px
</style>
