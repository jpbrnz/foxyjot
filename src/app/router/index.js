import Vue from 'vue'
import Router from 'vue-router'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import routes from './routes'
import dynamicRoutes from './dynamic-routes'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

let router = new Router({
  mode: 'history',
  routes
})

dynamicRoutes.addDynamicRoutesTo(router)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
