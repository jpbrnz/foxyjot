<template>
  <v-app light class="lead-gen">
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
      <section class="my-5">
        <v-container fill-height grid-list-lg>
          <v-layout row wrap align-center justify-center>
            <v-flex xs12 sm7>
              <h3 class="display-3">{{content.title}}</h3>
              <span class="subheading">{{content.description}}</span>
              <v-divider class="my-3"></v-divider>
              <vueShared></vueShared>
              <v-divider class="my-3"></v-divider>
              <div v-html="content.body"></div>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1 v-vpshow>
              <v-card color="blue-grey lighten-5">
                <v-container fluid grid-list-lg>
                  <v-layout row wrap>
                    <v-flex sm12>
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field
                          v-model="first"
                          :rules="firstRules"
                          label="First Name"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="last"
                          :rules="lastRules"
                          label="Last Name"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="phone"
                          :rules="phoneRules"
                          label="Phone"
                          required
                        ></v-text-field>
                        <v-checkbox
                          v-model="checkbox"
                          prepend-icon="visibility"
                          :prepend-icon-cb="() => (dialogTOS = !dialogTOS)"
                          :rules="[v => !!v || 'You must agree to continue!']"
                          label="Agree to terms"
                          hint="Click icon to review terms of service"
                          persistent-hint
                          required
                        ></v-checkbox>
                        <v-btn
                          :disabled="!valid"
                          @click="saveContact"
                          class="mt-3"
                        >
                          Register
                        </v-btn>
                        <v-btn class="mt-3" @click="clear">clear</v-btn>
                      </v-form>
                    </v-flex>
                    <v-dialog v-model="dialogTY" persistent max-width="290">
                      <v-card>
                        <v-card-title class="headline">Thank you</v-card-title>
                        <v-card-text>We received your regiastration and will follow up accordingly.</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat @click.native="dialogTY = false">Close</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogTOS" scrollable max-width="400px">
                      <v-card>
                        <v-card-title>Example TOS</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text style="height: 300px;">
                          <p>Bacon ipsum dolor amet biltong hamburger bacon ham hock, picanha buffalo rump. Beef turkey hamburger beef ribs cow shank swine andouille, pig kielbasa fatback shoulder boudin burgdoggen. Cow leberkas meatloaf, pork belly sirloin chuck pork burgdoggen tail strip steak beef short ribs porchetta buffalo landjaeger. Turducken bresaola ham hock, shoulder boudin ball tip brisket swine andouille.<br><br> Buffalo pork chop cupim ground round ham hock shankle brisket ribeye swine tenderloin chuck. Swine alcatra beef ribs meatball ribeye shank sirloin, kielbasa tongue. Frankfurter drumstick burgdoggen, bacon corned beef ham tongue chuck strip steak buffalo tri-tip pig. Pork belly tri-tip buffalo venison meatloaf swine, salami shoulder beef ribs kielbasa tail picanha jowl. Alcatra cow kielbasa, venison tri-tip hamburger shoulder jerky strip steak pork fatback filet mignon shank.<br><br> Landjaeger alcatra fatback swine hamburger spare ribs cow ball tip pork buffalo doner pancetta ground round. Pork chop kielbasa drumstick jerky. Sausage brisket sirloin filet mignon pork corned beef cow tail shoulder tongue porchetta salami picanha. Chuck bresaola fatback, shankle jerky leberkas t-bone pork chop pastrami turkey. Cupim salami burgdoggen, fatback ham brisket ball tip porchetta corned beef. Fatback tongue bresaola chicken beef ribs alcatra rump turkey cupim meatball beef short ribs.<br><br> Pork chop buffalo chicken, burgdoggen beef ribs picanha cow chuck ham. Alcatra sirloin beef burgdoggen. Jerky pork belly pork chop, frankfurter ball tip capicola burgdoggen cupim. Ball tip kevin prosciutto bacon cupim flank. Jerky fatback turkey bacon. Landjaeger prosciutto ham pork loin pork. Ribeye salami brisket, kevin spare ribs prosciutto turkey buffalo pastrami short ribs andouille turducken ham hock t-bone burgdoggen.<br></p>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn color="blue darken-1" flat @click.stop="dialogTOS = false">Close</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
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
import moment from 'moment'
import LoadContent from './LoadContent'
import { contactsRef } from '@/app/firebase_config'
import vueShared from '@/app/components/social/vueShared'
export default {
  mixins: [LoadContent],
  metaInfo: {
    title: 'FoxyJot',
    titleTemplate: '%s | Get started today!'
  },
  data () {
    return {
      ddown: false,
      drawer: false,
      valid: true,
      dialogTY: false,
      dialogTOS: false,
      first: '',
      firstRules: [
        v => !!v || 'First name is required',
        v => (v && v.length <= 15) || 'First name must be less than 10 characters'
      ],
      last: '',
      lastRules: [
        v => !!v || 'Last name is required',
        v => (v && v.length <= 15) || 'Last name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      phone: '',
      phoneRules: [
        (v) => !!v || 'Phone number is required',
        (v) => /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test(v) || 'Phone number must be valid'
      ],
      checkbox: false
    }
  },
  methods: {
    saveContact () {
      if (this.$refs.form.validate()) {
        contactsRef.push({
          first: this.first,
          last: this.last,
          email: this.email,
          phone: this.phone,
          offer: this.content.title,
          agree: this.checkbox
        })
        this.dialogTY = true
        this.$refs.form.reset()
      }
    },
    clear () {
      this.$refs.form.reset()
    },
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
