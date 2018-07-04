<div align="center">
  <p>
  <img src="https://raw.githubusercontent.com/jpbrnz/foxyjot/master/static/img/foxyjot-screen-set.png" width="48%">
</p>
  <p><a href="https://github.com/jpbrnz/foxyjot/wiki">STEP BY STEP GUIDE</a></p>
  <p><a href="https://travis-ci.org/jpbrnz/foxyjot"><img src="https://img.shields.io/travis/jpbrnz/foxyjot/master.svg?style=flat-square" alt="Travis branch"></a> <a href="https://github.com/jpbrnz/foxyjot/issues"><img src="https://img.shields.io/github/issues/jpbrnz/foxyjot.svg?style=flat-square" alt="GitHub issues"></a> <a href="https://github.com/jpbrnz/foxyjot/blob/master/LICENSE"><img src="https://img.shields.io/github/license/jpbrnz/foxyjot.svg?style=flat-square" alt="GitHub license"></a> <a href="https://twitter.com/intent/tweet?text=Wow:&amp;url=https%3A%2F%2Fgithub.com%2Fjpbrnz%2Ffoxyjot"><img src="https://img.shields.io/twitter/url/https/github.com/jpbrnz/foxyjot.svg?style=flat-square" alt="Twitter"></a></p>
</div>

--------------------------------------------------------------------------------

# FoxyJot - Write, Publish, Share, Grow

Exploring Vue.js, Vuetify and Firebase. Having a publishing and communications background, I wanted to put together a quick and fun way to write content while creating better experiences for developers and end users. These are great frameworks to explore and build some practical tools with. As we uncover more treasures Vue.js is capable of this project will continue to evolve. FoxyJot is a collection of the thoughts and work from the community busy making these frameworks incredible. From the blogs to the example packages, open source tools and incredible developers much appreciation. Now go and create something incredible.

# Getting Started

1. Clone the CMS repository and install the dependencies.

```bash
# clone the repo
git clone https://github.com/jpbrnz/foxyjot.git

# install the dependencies
npm install
# or
yarn
```

1. Log in to firebase console using your google account and create a new firebase project.

2. In the authentication section, select email password auth type and create a new user by providing an email and a password. Then copy that users UID from the list.

3. Example database basic security rules included in package. Simply replace YOURID-UID with the actual UID copied from your Firebase console.

```javascript
{
  "rules": {
    ".write": "auth != null && auth.uid === 'YOURID-UID'"
```

1. Copy your project configurations from WEB SETUP (_in `authentication` section of the firebase console_) and paste them in `config.js` inside firebase_config folder. Here is the content of the config.js file.

```javascript
// replace the existing config object below
let config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
};
export default config
```

1. Run the `firebase init` command (if you haven't installed firebase tools yet, do so), select your project from the list, select NO to overwrite database rules already present. Use the existing `database.rules.json` in the package, choose `dist` as your public directory and configure the project as a single-page app.

2. You can now use `firebase deploy` to deploy the security rules you just entered (to deploy the actual web app you must first use `npm run build` or `yarn build`).

3. Run the local dev server with `npm run dev` or `yarn dev`.

4. Access the admin interface by navigating to `localhost:8080/admin`.

5. Sign in with your email and password.

6. Start creating!

NOTE: In Settings and database panel you can load demo content to get started.

Lead Generation: The leadGen template includes a form that posts leads to Firebase and from there you can export import to SFDC, or zap a sync between the leads reference in db and salesforce, or other CRM tools. Easily extend, or decrease the number of fields and specific fields required to submit the form. Track requests based on url of page.

Google Tag Manager - To add tag manager tracking go to index.html file and update the tag manager ID (e.g. GTM-XXXXXXX). In order to track each page view setup a change history trigger and Google Analytics tag. If you have not done so already, create a Tag Manager account and Analytics account.

To customize the theme, simply update Vuetify's theme using the colors in main.js file here:

```bash
Vue.use(Vuetify, {
  theme: {
    primary: colors.grey.darken2,
    secondary: colors.green.lighten4,
    accent: colors.green.base
  }
})
```

Make writing fun again and leverage basic lead generation for events, newsletters, offers and more. Package extras include lead generation form/template, Social sharing and Google Tag Manager. User registration is included (more to come on this feature, currently just the baseline).

Credits: [Vue](http://vuejs.org/) - [Vuetify](https://vuetifyjs.com/) - [Tamiat](https://github.com/tamiat/tamiat) - [Firebase](https://firebase.google.com/) - [Vue-Quill-Editor](https://github.com/surmon-china/vue-quill-editor) - [Quilljs](https://quilljs.com/docs/quickstart/)
