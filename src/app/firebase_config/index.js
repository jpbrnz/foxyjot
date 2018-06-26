/* This is the Firebase configuration file */
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import config from './config'

export const app = firebase.initializeApp(config)

export const auth = firebase.auth()
export const db = firebase.database()
export const stor = firebase.storage()
// create a database references
export const settingsRef = db.ref('settings')
export const mediaRef = db.ref('media')
export const navRef = db.ref('nav')
export const contentsRef = db.ref('contents')
export const fieldsRef = db.ref('fields')
export const contactsRef = db.ref('leads')
export const routesRef = db.ref('routes')

export default firebase
