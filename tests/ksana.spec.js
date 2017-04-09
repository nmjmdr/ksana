const chai = require('chai')
const chaisAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const ksana = require('../src/ksana')
const eventEmitter = require('events')

chai.use(chaisAsPromised)
const expect = chai.expect

describe('Using kSaNa',()=>{
  let clock
  let sandbox
  beforeEach(()=>{
    clock = sinon.useFakeTimers()
    sandbox = sinon.sandbox.create()
  })
  afterEach(()=>{
    clock.restore()
    sandbox.restore()
  })
  describe('Within a time-interval',()=>{
    describe('An event starts the time window',()=>{
      const emitter = new eventEmitter();
      let onEvent = 'on-event'
      let afterTime = 5
      let triggerEvent = 'another-event'
      let cancelEvent = 'cancelation-event'

      describe('If the cancel event is not triggered within the time-interval',()=>{
        let k
        before(()=>{
          k = ksana.on(emitter,onEvent)
          .afterTime(afterTime)
          .trigger(triggerEvent)
        })
        after(()=>{
          k.stop()
        })
        it('Should trigger the event',(done)=>{
          let payload = "hello"
          emitter.on(triggerEvent,(p)=>{
            expect(p).to.deep.equal(payload)
            return done()
          })
          emitter.emit(onEvent,payload)
          clock.tick(afterTime)
        })
      })

      describe('If the cancel event is triggered within the time-interval',()=>{
        let k
        before(()=>{
          k = ksana.on(emitter,onEvent)
          .afterTime(afterTime)
          .trigger(triggerEvent)
          .cancelOn(cancelEvent)
        })
        after(()=>{
          k.stop()
        })
        it('Should NOT trigger the event',(done)=>{
          let payload = "hello"
          let triggerEventCalled = false
          let delta = after/10
          emitter.on(triggerEvent,(p)=>{
            triggerEventCalled = true
          })
          k._internal.onCancalled = ()=>{
            expect(triggerEventCalled).to.be.false
            return done()
          }
          emitter.emit(onEvent,payload)
          clock.tick(afterTime-delta)
          emitter.emit(cancelEvent,{})
        })
      })

    })

    describe('Counting instances of the event',()=>{
      const emitter = new eventEmitter();
      let onEvent = 'on-event'
      let triggerEvent = 'another-event'

      describe('After "x" instances of the event',()=>{
        let k
        let n = 10
        before(()=>{
          k = ksana.on(emitter,onEvent)
          .afterNTimes(n)
          .trigger(triggerEvent)
        })
        after(()=>{
          k.stop()
        })
        it('Should trigger another event',(done)=>{
          let payload = "hello"
          emitter.on(triggerEvent,(p)=>{
            expect(p).to.deep.equal(payload)
            return done()
          })
          for(i=0;i<n;i++) {
            emitter.emit(onEvent,payload)
          }
        })
      })

      describe('Every "x" instances of the event',()=>{
        let k
        let n = 10
        let cycles = 2
        before(()=>{
          k = ksana.on(emitter,onEvent)
          .afterNTimes(n)
          .trigger(triggerEvent)
        })
        after(()=>{
          k.stop()
        })
        it('Should trigger another event',(done)=>{
          let payload = "hello"
          let called = 0
          emitter.on(triggerEvent,(p)=>{
            expect(p).to.deep.equal(payload)
            called = called + 1
            if(called == cycles) {
              return done()
            }
          })
          for(i=0;i<n*cycles;i++) {
            emitter.emit(onEvent,payload)
          }
        })
      })

      describe('After "x" instances and a few more of the event',()=>{
        let k
        let n = 10
        let few = n/2
        before(()=>{
          k = ksana.on(emitter,onEvent)
          .afterNTimes(n)
          .trigger(triggerEvent)
        })
        after(()=>{
          k.stop()
        })
        it('Should still trigger another event only once',(done)=>{
          let payload = "hello"
          let called = 0
          emitter.on(triggerEvent,(p)=>{
            expect(p).to.deep.equal(payload)
            called = called + 1
          })
          for(i=0;i<n+few;i++) {
            emitter.emit(onEvent,payload)
          }
          expect(called).to.be.equal(1)
          return done()
        })
      })
    })
  })
})
