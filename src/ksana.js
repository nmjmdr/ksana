

function on(emitter,name) {
  let observable = {
    emitter: emitter,
    after: after,
    trigger: trigger,
    cancelOn: cancelOn,
    stop: stop,
    _internal: {
      handler: null,
      onTime: null,
      timer: null,
      onCancalled: null
    }
  }
  observable.emitter.on(name,(payload)=>{
    if(observable._internal.handler) {
      observable._internal.handler(payload)
    }
  })
  return observable
}

function stop() {
  if(this.emitter) {
    this.emitter.removeAllListeners()
  }
  if(this._internal.timer) {
    clearTimeout(this._internal.timer)
  }
}

function after(time) {
  this._internal.handler = (payload)=>{
    this._internal.timer = setTimeout(()=>{
      if(this._internal.onTime) {
        this._internal.onTime(payload)
      }
    },time)
  }
  return this
}

function trigger(eventName) {
  this._internal.onTime = (payload)=>{
    this.emitter.emit(eventName,payload)
  }
  return this
}

function cancelOn(eventName) {
  this.emitter.on(eventName,()=>{
    if(this._internal.timer) {
      clearTimeout(this._internal.timer)
      if(this._internal.onCancalled) {
        this._internal.onCancalled()
      }
    }
  })
  return this
}

module.exports = {
  on : on
}
