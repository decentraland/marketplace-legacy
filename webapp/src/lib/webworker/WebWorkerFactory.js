export class WebWorkerFactory {
  static create(WebWorkerFunction) {
    const onmessage = WebWorkerFunction.toString().replace(
      WebWorkerFunction.name,
      'onmessage'
    )
    const code = `var onmessage = ${onmessage}`

    const blob = new window.Blob([code], { type: 'application/javascript' })
    const worker = new window.Worker(window.URL.createObjectURL(blob))
    return new WebWorker(worker)
  }
}

export class WebWorker {
  constructor(worker) {
    this.worker = worker
    this.messageMap = {}

    this.listenForAnswers()
  }

  listenForAnswers() {
    this.worker.addEventListener(
      'message',
      event => {
        const action = event.data
        const type = this.buildType(action, action.timestamp)

        if (this.messageMap[type]) {
          this.messageMap[type].resolve(action)
          delete this.messageMap[type]
        }
      },
      false
    )
  }

  addEventListener(message, callback) {
    this.worker.addEventListener(message, callback)
  }

  postMessage(message) {
    if (!message.type) {
      throw new Error('Please add a type to your web worker message')
    }
    const timestamp = Date.now()
    const type = this.buildType(message, timestamp)

    this.worker.postMessage({ ...message, timestamp })

    return new Promise(
      (resolve, reject) => (this.messageMap[type] = { resolve, reject })
    )
  }

  buildType(message, timestamp = Date.now()) {
    return message.type + timestamp
  }
}
