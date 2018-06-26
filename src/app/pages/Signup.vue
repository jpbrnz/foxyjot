<template>
  <v-app>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3  class="text-xs-center" mt-5>
          <v-card v-vpshow>
            <v-card-text>
              <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Get started now!</h1>
              </v-flex>
              <v-flex>
                <router-link to="/"><img src="/static/img/foxyjot-logo.png" class="flogo" alt="FoxyJot logo"></router-link>
              </v-flex>
              <v-flex xs12 sm6 offset-sm3 mt-3>
                <form @submit.prevent="userSignUp">
                  <v-layout column>
                    <v-flex>
                      <v-alert type="error" dismissible v-model="alert">
                        {{ error }}
                      </v-alert>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        name="email"
                        label="Email"
                        id="email"
                        type="email"
                        v-model="email"
                        prepend-icon="contact_mail"
                        required></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        type="password"
                        v-model="password"
                        prepend-icon="lock"
                        required></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        name="confirmPassword"
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        prepend-icon="check_box"
                        required
                        v-model="passwordConfirm"
                        :rules="[comparePasswords]"
                        ></v-text-field>
                    </v-flex>
                    <v-flex class="text-xs-center" mt-5>
                      <v-btn color="primary" type="submit" :disabled="loading">Sign Up</v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'ureg',
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      alert: false
    }
  },
  computed: {
    comparePasswords () {
      return this.password === this.passwordConfirm ? true : 'Passwords don\'t match'
    },
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  methods: {
    userSignUp () {
      if (this.comparePasswords !== true) {
        return
      }
      this.$store.dispatch('userSignUp', { email: this.email, password: this.password })
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
