import { stor, mediaRef } from '@/app/firebase_config'

export default {
  methods: {
    async uploadImage (e) {
      let file = e.target.files[0]
      let storageRef = stor.ref('images/' + file.name)

      let snapshot = await storageRef.put(file)

      this.createNewMedia(snapshot)
      this.insertImageIntoDOM(snapshot.downloadURL)
    },
    createNewMedia (snapshot) {
      mediaRef.push({
        src: snapshot.downloadURL,
        path: snapshot.ref.fullPath,
        name: snapshot.metadata.name
      })
    },
    insertImageIntoDOM (url) {
      let img = document.createElement('img')
      img.src = url
      document.getElementsByClassName('ql-editor')[0].appendChild(img)
    }
  }
}
