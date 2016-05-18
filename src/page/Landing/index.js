import xs from 'xstream'
import isolate from '@cycle/isolate'
import {h1} from '@cycle/dom'

// TODO: Finish implementing
function Landing (sources) {
  return {
    DOM: xs.of(h1('.welcome', 'Welcome to the Sparks.Network'))
  }
}

export default sources => isolate(Landing)(sources)
