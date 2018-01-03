import { env } from 'decentraland-commons'
import { insertScript } from './utils'

const APP_ID = env.get('REACT_APP_INTERCOM_APP_ID', '')

const intercomUtils = {
  inject() {
    return new Promise((resolve, reject) => {
      if (this.injected()) return resolve()

      window.intercomSettings = {
        alignment: 'left',
        horizontal_padding: 10,
        vertical_padding: 10
      }

      const script = insertScript({
        src: `https://widget.intercom.io/widget/${APP_ID}`
      })
      script.addEventListener('load', resolve, true)
    })
  },

  injected() {
    return typeof window.Intercom === 'function'
  },

  render(address) {
    IntercomFn('reattach_activator')
    IntercomFn('update', { app_id: APP_ID, address })
  },

  showNewMessage(text) {
    IntercomFn('showNewMessage', text)
  },

  shutdown() {
    IntercomFn('shutdown')
  }
}

function IntercomFn(...args) {
  if (env.isDevelopment()) {
    return
  }

  if (!intercomUtils.injected()) {
    return console.warn('Intercom called before injection')
  }

  if (!APP_ID) {
    return console.warn('Intercom app id empty. Check that the environment is propery set')
  }

  window.Intercom(...args)
}

export default intercomUtils
