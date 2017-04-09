

function on(emitter,name) {
  return {
    event: {
      emitter: emitter,
      name: name
    },
    after: after,
    cancelOn: cancelOn
  }
}

function after(time) {
  let observable = this
  return {
    time: time,
    observable : observable,
    trigger: trigger
  }
}

function trigger(eventName) {
  this.observable.timer = setTimeout(()=>{
    this.observable.event.emitter.emit(eventName)
  },this.observable.time)
  return this.observable
}

function cancelOn(eventName) {
  this.event.emitter.on(eventName,()=>{
    this.timer.clearTimeout()
  })
}

module.exports = {
  on : on
}
