

function on(emitter,name) {
  let observable = {
    emitter: emitter,
    after: after,
    trigger: trigger,
    cancelOn: cancelOn,
    _internal: {
      handler: null,
      onTime: null
    }
  }
  observable.emitter.on(name,(payload)=>{
    if(observable._internal.handler) {
      observable._internal.handler(payload)
    }
  })
  return observable
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

}

module.exports = {
  on : on
}
