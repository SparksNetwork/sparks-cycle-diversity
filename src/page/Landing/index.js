import xs from 'xstream'
import isolate from '@cycle/isolate'
import {h1} from '@cycle/dom'

function Landing (sources) {
  return {
    DOM: xs.of(
      h1('.welcome', {polyglot: {phrase: 'welcome', name: 'Sparks.Network'}})
    )
  }
}

export default sources => isolate(Landing)(sources)
