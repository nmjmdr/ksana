const chai = require('chai')
const chaisAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const ksana = require('../src/ksana')
const eventEmitter = require('events')

chai.use(chaisAsPromised)
const expect = chai.expect

describe('Using kSaNa',()=>{
  let clock
  beforeEach(()=>{
    clock = sinon.useFakeTimers()
  })
  afterEach(()=>{
    clock.restore()
  })
  describe('Within a time-interval',()=>{
    describe('An event starts the time window',()=>{
      const emitter = new eventEmitter();
      let onEvent = 'on-event'
      let afterTime = 5
      let triggerEvent = 'another-event'
      let cancelEvent = 'cancelation-event'

      ksana.on(emitter,onEvent)
      .after(afterTime)
      .trigger(triggerEvent)
      .cancelOn(cancelEvent)

      describe('If the cancel event is not triggered within the time-interval',()=>{
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
    })
  })
})
