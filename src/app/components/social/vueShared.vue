<template>
<div>
  <div v-if="this.$props.bundle === 'en'">
    <v-tooltip top color="primary">
      <v-icon slot="activator" class="primary--text share_ico">share</v-icon>
      <span>Spread the word</span>
    </v-tooltip>
    <FacebookShare has_icon></FacebookShare>
    <LinkedInShare has_icon></LinkedInShare>
    <TwitterShare has_icon></TwitterShare>
    <GooglePlusShare has_icon></GooglePlusShare>
  </div>
</div>
</template>

<script>
import FacebookShare from './Facebook.vue'
import GooglePlusShare from './GooglePlus.vue'
import TwitterShare from './Twitter.vue'
import LinkedInShare from './LinkedIn.vue'

export default {
  name: 'vueShared',
  props: {
    bundle: {
      type: String,
      default: 'en'
    }
  },
  components: {
    FacebookShare,
    GooglePlusShare,
    LinkedInShare,
    TwitterShare
  }
}
</script>
<style scoped lang="scss">
.share_ico {
  font-size: 35px;
}
</style>
