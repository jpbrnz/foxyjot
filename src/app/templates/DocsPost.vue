<template>
  <!-- &copy; 2018 foxyjot -->
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
        <v-jumbotron color="grey lighten-2">
          <v-container fill-height>
            <v-layout align-center>
              <v-flex xs12 sm10 offset-sm1>
                <h3 class="display-3">{{content.title}}</h3>
                <span class="subheading">{{content.description}}</span>
                <v-divider class="my-3"></v-divider>
                <span class="author_date grey--text lighten-3">
                  <v-icon small class="grey--text lighten-3">
                    person_outline
                  </v-icon>
                  <em>Created by <b>{{content.author}}</b> on <b>{{ formatDate(content.created) }}</b></em>
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-jumbotron>
      </section>
      <section>
        <v-container>
          <v-layout
            row
            wrap
            class="mb-5"
            align-center
          >
            <v-flex xs12 sm10 offset-sm1 class="my-3">
              <div class="mt-3" v-html="content.body"></div>
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

export default {
  mixins: [LoadContent],
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | Documentation'
  },
  data () {
    return {
      ddown: false,
      drawer: false,
      gradient: 'to top right, rgba(63,81,181, .7), rgba(25,32,72, .7)'
    }
  },
  methods: {
    formatDate (epoch) {
      if (!epoch) return // if no time return nothing
      return moment(epoch).format('MM/DD/YY')
    }
  }
}
</script>

<style lang="sass">
@import '../styles/index.sass'
p
  font-size: 1.2rem
.author_name
  margin-right: 20px

.author_hold
  position: relative
  margin: 0
  padding: 0
  width: 100%
.chip__content
  .icon
    font-size: 10px
  .author_name
    font-size: 10px
.author
  position: absolute
  right: 50px
  top: -80px
</style>
