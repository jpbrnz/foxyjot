import Vue from 'vue'
import App from './App'
import router from './app/router'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import VueFire from 'vuefire'
import VueQuillEditor from 'vue-quill-editor'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import store from './app/store'

Vue.use(VueFire)
Vue.use(VueQuillEditor)
Vue.use(Vuetify, {
  theme: {
    primary: colors.grey.darken3,
    secondary: colors.grey.base,
    accent: colors.green.base
  }
}) // activate vuetify

Vue.directive('vpshow', {
  inViewport (el) {
    var rect = el.getBoundingClientRect()
    return !(rect.bottom < 0 || rect.right < 0 ||
             rect.left > window.innerWidth ||
             rect.top > window.innerHeight)
  },

  bind (el, binding) {
    el.classList.add('before-enter')
    el.$onScroll = function () {
      if (binding.def.inViewport(el)) {
        el.classList.add('enter')
        el.classList.remove('before-enter')
        binding.def.unbind(el, binding)
      }
    }
    document.addEventListener('scroll', el.$onScroll)
  },

  inserted (el, binding) {
    el.$onScroll()
  },

  unbind (el, binding) {
    document.removeEventListener('scroll', el.$onScroll)
    delete el.$onScroll
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const unsubscribe = firebase.auth()
  .onAuthStateChanged((firebaseUser) => {
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
      created () {
        if (firebaseUser) {
          store.dispatch('autoSignIn', firebaseUser)
        }
      }
    })
    unsubscribe()
  })
