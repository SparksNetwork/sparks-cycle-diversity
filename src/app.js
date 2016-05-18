// External imports
import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeRouterDriver, supportsHistory} from 'cyclic-router'
import {createHistory, createHashHistory} from 'history'

// TODO: make use of these
// import Firebase from 'firebase'
// import {makeAuthDriver, makeFirebaseDriver, makeQueueDriver} from 'cyclic-fire' // rewrite cyclic-fire?

// Local imports
import main from 'page/main'

const history = supportsHistory()
  ? [createHistory(), {capture: true}]
  : [createHashHistory(), {capture: false}]

// const firebaseRef = new Firebase(__FIREBASE_HOST__)

const drivers =
  {
    DOM: makeDOMDriver('#app', {transposition: false}), // TODO: Do we want to turn on transposition?
    router: makeRouterDriver(...history)
    // firebase: makeFirebaseDriver(firebaseRef),
    // auth$: makeAuthDriver(firebaseRef),
    // queue$: makeQueueDriver(firebaseRef),
    // isMobile$ // TODO: Do we want to handle this via JS still or move to CSS + media queries?
  }

const dispose = Cycle.run(main, drivers)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    dispose()
  })
}
