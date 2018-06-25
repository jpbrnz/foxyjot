export default {
  data () {
    return {
      notification: {
        type: '',
        message: '',
        snackbar: false,
        y: 'bottom'
      }
    }
  },
  methods: {
    showNotification (type, message) {
      this.notification.type = type
      this.notification.message = message
      this.snackbar = true
      setTimeout(() => {
        this.hideNotifications()
      }, 3000)
    },
    hideNotifications () {
      // hide all notifications
      this.snackbar = false
      this.notification.type = ''
      this.notification.message = ''
    }
  }
}
