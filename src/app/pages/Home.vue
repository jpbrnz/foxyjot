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
        <v-parallax :src="require('../assets/light-bg.png')" height="600">
          <v-layout
            column
            align-center
            justify-center
            class="black--text"
          >
            <img src="../assets/img/logo.svg" alt="Vuetify.js" height="200">
            <h1 class="black--text mb-2 display-1 text-xs-center">{{settings.title}}</h1>
            <div class="subheading mb-3 text-xs-center">{{settings.description}}<br><h6>(Demo site created using FoxyJot)</h6></div>
            <v-btn
              class="primary mt-3"
              dark
              large
              @click="$vuetify.goTo(target, options)"
            >
              Get Started
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>
      <section id="getStarted">
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">The best way to start developing</h2>
              <span class="subheading">
                No need to wait. Start building now!
              </span>
              <v-divider class="my-3"></v-divider>
              <vueShared></vueShared>
              <v-divider class="my-3"></v-divider>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md6>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <img :src="require('../assets/img/foxyjot-screen-set.png')" style="width:100%;">
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-left">
                      <p>A quick and easy way to get started creating elegant designs that allow your site visitors to consume content in the best way possible. To get started clone or download the repository from github.</p>
                      <kbd> git clone https://github.com/jpbrnz/foxyjot.git </kbd>
                      <p class="mt-3">Or download the repo <a href="https://github.com/jpbrnz/foxyjot.git" target="_blank">https://github.com/jpbrnz/foxyjot.git</a></p>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl class="my-4">
              <v-layout row wrap align-center v-vpshow>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <img :src="require('../assets/img/screen1.png')" class="elevation-3" style="width:100%;">
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Content Types</div>
                    </v-card-title>
                    <v-card-text class="text-xs-center">
                      Create new content, define the name and select one or more fields from available list. The fields that are currently available in the database will be displayed. By checking a field from that list it is included in the creation of content type.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <img :src="require('../assets/img/screen2.png')" class="elevation-3" style="width:100%;">
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Create Content</div>
                    </v-card-title>
                    <v-card-text class="text-xs-center">
                      After successfull creation, content types are displayed in the dropdown menu Content in the application dashboard. Now your off and can start to Create (Save/Publish), Edit, Delete, Filter and Sort content.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <img :src="require('../assets/img/screen3.png')" class="elevation-3" style="width:100%;">
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Route Content</div>
                    </v-card-title>
                    <v-card-text class="text-xs-center">
                      With dynamic routes you are in complete control and have the total freedom about the presentation of your content. You can associate the content that you want with the template that you want and the url that you want.
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section class="mb-4">
        <v-parallax :src="require('../assets/light-bg.png')" height="380">
          <v-layout column align-center justify-center>
            <div class="headline black--text mb-3 text-xs-center">Web development has never been easier</div>
            <em class="black--text">Kick-start your project today</em>
            <v-btn
              class="primary mt-3"
              dark
              large
              href="https://github.com/jpbrnz/foxyjot.git"
              target="_blank"
            >
              Try it now!
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl class="mt-5">
          <v-layout row wrap justify-center>
            <v-flex xs12 sm6>
              <v-card class="elevation-0 transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">App Benefits</div>
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <p>Improve user experiences, give developers the ability to apply their creativity to deliver faster, more responsive user experiences.</p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-center v-vpshow>
            <v-flex xs12 md4>
              <v-card class="elevation-0 transparent">
                <v-card-text class="text-xs-center">
                  <img :src="require('../assets/img/networking.svg')" class="elevation-0" style="width:40%;">
                </v-card-text>
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline text-xs-center">Social Sharing</div>
                </v-card-title>
                <v-card-text class="text-xs-center">
                  Social sharing is built in, so you can quickly and easily spread the word about your offering, event, or product.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md4>
              <v-card class="elevation-0 transparent">
                <v-card-text class="text-xs-center">
                  <img :src="require('../assets/img/leads.svg')" class="elevation-0" style="width:55%;">
                </v-card-text>
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline text-xs-center">Lead Generation</div>
                </v-card-title>
                <v-card-text class="text-xs-center">
                  Create new leads and customers. Quickly access signup and registrations. Store them or setup a zap to pass them to your favorite crm.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md4>
              <v-card class="elevation-0 transparent">
                <v-card-text class="text-xs-center">
                  <img :src="require('../assets/img/fun.svg')" class="elevation-0" style="width:40%;">
                </v-card-text>
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Creative Freedom</div>
                </v-card-title>
                <v-card-text class="text-xs-center">
                  Save time and energy, while focusing on your core goals. Take time back and relax while your content is put to work.
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-center class="mb-5" v-vpshow>
            <v-flex xs12 sm8>
              <v-card class="elevation-0 transparent">
                <v-container fluid grid-list-lg>
                  <v-layout row wrap align-center>
                    <v-flex xs12 sm6>
                      <v-card-media
                        :src="require('../assets/img/ga-tag-manager.png')"
                        height="150px"
                        contain
                      ></v-card-media>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <div class="mt-2 text-xs-center">
                        <div class="headline">Tracking &amp; Analytics</div>
                        <div>Leverage Google Tag Manager to track activity in your application.</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>
      <section class="grey darken-4">
        <v-container grid-list-xl>
          <v-layout row wrap justify-center>
            <v-flex xs12 class="justify-center">
              <h4 class="grey--text text--lighten-3 text-xs-center">BUILT WITH</h4>
            </v-flex>
            <v-flex xs4>
              <v-card class="elevation-2 primary darken-1">
                <v-container fluid grid-list-lg>
                  <v-layout row wrap align-center>
                    <v-flex xs12>
                      <v-tooltip bottom>
                        <v-card-media
                          :src="require('../assets/img/vue-logo.svg')"
                          height="50px"
                          contain
                          class="credImg"
                          slot="activator"
                        ></v-card-media>
                        <span>Vue</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs4>
              <v-card class="elevation-2 primary darken-1">
                <v-container fluid grid-list-lg>
                  <v-layout row wrap align-center>
                    <v-flex xs12>
                      <v-tooltip bottom>
                        <v-card-media
                          :src="require('../assets/img/vuetify-logo.svg')"
                          height="50px"
                          contain
                          class="credImg"
                          slot="activator"
                        ></v-card-media>
                        <span>Vuetify</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs4>
              <v-card class="elevation-2 primary darken-1">
                <v-container fluid grid-list-lg>
                  <v-layout row wrap align-center>
                    <v-flex xs12>
                      <v-tooltip bottom>
                        <v-card-media
                          :src="require('../assets/img/firebase-logo.svg')"
                          height="50px"
                          contain
                          class="credImg"
                          slot="activator"
                        ></v-card-media>
                        <span>Firebase</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
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
import * as easings from 'vuetify/es5/util/easing-patterns'
import vueShared from '@/app/components/social/vueShared'
export default {
  name: 'home',
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | Creative content management'
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
    },
    target () {
      const value = '#getStarted'
      if (!isNaN(value)) return Number(value)
      else return value
    },
    options () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    }
  },
  data () {
    return {
      ddown: false,
      drawer: false,
      duration: 1000,
      offset: -50,
      easing: 'easeInOutCubic',
      easings: Object.keys(easings)
    }
  },
  methods: {
    toggleNav (event) {
      const targetElement = event.target.parentElement.parentElement
      if (targetElement.nodeName === 'LI') {
        targetElement.className = targetElement.className === 'open' ? '' : 'open'
      }

      event.preventDefault()
    }
  },
  components: {
    vueShared
  }
}

</script>

<style lang="scss" scoped>
.before-enter {
  opacity: 0;
}
.enter {
  animation: fadeInUp 1.5s ease;
}
.cred {
  font-size: 1.2rem;
}
.credImg {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
.share_ico {
  font-size: 35px;
}
.loading {
  position: relative;
}

.loading-bar {
  display: inline-block;
  width: 2px;
  height: 8px;
  border-radius: 2px;
  animation: loading .5s ease-in-out infinite;
  &:nth-child(1) {
    background-color: #616161;
    animation-delay: 0;
  }
  &:nth-child(2) {
    background-color: #010101;
    animation-delay: 0.09s;
  }
  &:nth-child(3) {
    background-color: #616161;
    animation-delay: .18s;
  }
}

@keyframes loading {
  0% {
    transform: scale(1);
  }

  20% {
    transform: scale(1, 2.2);
  }

  40% {
    transform: scale(1);
  }
}

.line {
  position: absolute;
  top: 50%;
  margin-left: 0;
  width: 30px;
  height: 2px;
  background: #424242;
  animation: spin 1.5s infinite ease;

  &:nth-of-type(2) { animation-delay: 0.1s; }
  &:nth-of-type(3) { animation-delay: 0.2s; }
  &:nth-of-type(4) { animation-delay: 0.3s; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.websiteLogo {
  img {
    width: 100%;
    max-width: 25px;
    margin-top: 0.9rem;
  }
}
.bigi {
  font-size: 5rem;
}
</style>
