// &copy; foxyjot.com //
import { contentsRef, routesRef, navRef, mediaRef } from '@/app/firebase_config/index'
import contentFetch from '@/app/mixins/contentFetch'
export default {
  mixins: [contentFetch],
  firebase: {
    routes: routesRef,
    contents: contentsRef,
    nav: {
      source: navRef
    },
    media: {
      source: mediaRef
    }
  },
  computed: {
    content () {
      let currentRoute = this.routes.filter((route) => {
        return route.path === this.$route.path
      })[0]
      let contentType = currentRoute.contentType
      let contentId = currentRoute.content || 'none'
      return this.selectContentByTypeAndId(contentType, contentId)
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
  }
}
