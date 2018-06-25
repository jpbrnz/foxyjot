<template>
  <v-app>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3  class="text-xs-center" mt-5>
        <v-card v-vpshow>
          <v-card-text>
            <h1>Dashboard Login</h1>
            <v-flex xs12 sm6 offset-sm3 mt-3>
              <v-layout column>
                <v-flex>
                  <v-alert type="error" dismissible v-model="alert">
                    {{ error }}
                  </v-alert>
                </v-flex>
                <v-flex>
                  <router-link to="/">
                    <v-tooltip bottom>
                      <div slot="activator">
                        <img src="/static/img/foxyjot-logo.png" class="flogo" alt="FoxyJot logo">
                      </div>
                      <span>Back to home</span>
                    </v-tooltip>
                  </router-link>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    id="Email"
                    @keyup.enter="userSignIn"
                    color="blue-grey darken-3"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <v-text-field
                    v-model="password"
                    type="password"
                    label="Password"
                    id="Password"
                    @keyup.enter="userSignIn"
                    color="blue-grey darken-3"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex class="text-xs-center" mt-5>
                  <v-btn type="submit" color="primary" @click="userSignIn">Sign In</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import notifier from '@/app/mixins/notifier'

export default {
  name: 'log-in',
  data () {
    return {
      email: '',
      password: '',
      snackbar: false,
      y: 'bottom',
      mode: '',
      alert: false
    }
  },
  mixins: [notifier],
  methods: {
    userSignIn () {
      this.$store.dispatch('userSignIn', { email: this.email, password: this.password })
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}

</script>

<style lang="sass">
@import '../styles/index.sass'
.flogo
  width: 100%
  max-width: 100px
</style>
