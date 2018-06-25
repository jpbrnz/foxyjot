<div align="center">
  <p>
  <img src="https://raw.githubusercontent.com/jpbrnz/foxyjot/master/static/img/foxyjot-screen-set.png" width="48%">
</p>
  <p><a href="https://travis-ci.org/jpbrnz/foxyjot"><img src="https://img.shields.io/travis/jpbrnz/foxyjot/master.svg" alt="Travis branch"></a> <a href="https://github.com/jpbrnz/foxyjot/issues"><img src="https://img.shields.io/github/issues/jpbrnz/foxyjot.svg" alt="GitHub issues"></a> <a href="https://github.com/jpbrnz/foxyjot/blob/master/LICENSE"><img src="https://img.shields.io/github/license/jpbrnz/foxyjot.svg" alt="GitHub license"></a> <a href="https://twitter.com/intent/tweet?text=Wow:&amp;url=https%3A%2F%2Fgithub.com%2Fjpbrnz%2Ffoxyjot"><img src="https://img.shields.io/twitter/url/https/github.com/jpbrnz/foxyjot.svg?style=social" alt="Twitter"></a></p>
</div>

--------------------------------------------------------------------------------

# FoxyJot - Write, Publish, Share, Grow

Exploring Vue, Vuetify, Firebase. Creating a content management system that allows for flexible and quick development. Core features include creating content types, content, routing content, storing media and creating templates for content. Keeping the repository light and simple so customizing it can be done efficiently. This project was created to get under the hood of Vue.js and understand how quickly and effectively both template and content management can be done. These are great frameworks to explore and build some practical tools with.

As we uncover more treasures Vue is capable of this project will continue to evolve. FoxyJot is a collection of the thoughts and work from the community busy making these frameworks incredible. From the blogs to the example packages, open source tools and incredible developers much appreciation.

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

2. In the authentication section, select email password auth type and add a new user by providing an email and a password.

3. Example database basic security rules included in package.

```javascript
{
  "rules": {
    ".write": "auth != null && auth.uid === 'YOURID-UID'"
```

1. Copy your project configurations from WEB SETUP (_in `authentication` section of the firebase console_) and paste them in `config.js` inside firebase_config folder by creating it, or replacing the existing ones (hidden).

```javascript
// replace the existing config object below
let config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
```

1. Run the `firebase init` command (if you haven't installed firebase yet, do so), select your project from the list, select no to overwrite database rules already present and use existing `database.rules.json` in package, choose `dist` as your public directory and configure the project as a single-page app.

2. You can now use `firebase deploy` to deploy the security rules you just entered (to deploy the actual web app you must first use `npm run build` or `yarn build`).

3. Run the local dev server with `npm run dev` or `yarn dev`.

4. Access the admin interface by navigating to `localhost:8080/admin`.

5. Sign in with your email and password.

6. Start creating!

NOTE: In Settings and database panel you can load content to get started.

Lead Generation: The leadGen template includes a form that posts leads to Firebase and from there you can export import to SFDC, or zap a sync between the leads reference in db and salesforce, or other CRM tools. Easily extend, or decrease the number of fields and specific fields required to submit the form.

To customize the core theme, simply update the colors in main.js file here:

```bash
Vue.use(Vuetify, {
  theme: {
    primary: colors.grey.darken2,
    secondary: colors.green.lighten4,
    accent: colors.green.base
  }
})
```

Basic lead generation form and landing page template. Social sharing for any post type using the templates, or inlcuding the code in your own. Google Tag Manager is in the of the index.html file. Add your own ID in order to track activity in your application. User registration is inlcuded (more to come on this feature, currently just the baseline).

Credits: [Vue](http://vuejs.org/) - [Vuetify](https://vuetifyjs.com/) - [Tamiat](https://github.com/tamiat/tamiat) - [Firebase](https://firebase.google.com/) - [Quilljs](https://quilljs.com/docs/quickstart/)
