import 'es6-shim' // suppport more browsers
// External imports
import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeRouterDriver, supportsHistory} from 'cyclic-router'
import {createHistory, createHashHistory} from 'history'

import firebase from 'firebase'

const fbConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
}
firebase.initializeApp(fbConfig)

import {makeAuthDriver, makeFirebaseDriver, makeQueueDriver} from './cyclic-fire'
import main from 'page/main'
import {makePolyglotModule} from 'module/polyglot'
import {translations} from 'translation'

const modules =
  [
    require('snabbdom/modules/class'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/style'),
    makePolyglotModule(translations)
  ]

const history = supportsHistory()
  ? [createHistory(), {capture: true}]
  : [createHashHistory(), {capture: false}]

const drivers =
  {
    DOM: makeDOMDriver('#app', {transposition: false, modules}),
    router: makeRouterDriver(...history),
    firebase: makeFirebaseDriver(firebase.database().ref()),
    auth$: makeAuthDriver(firebase.auth()),
    queue$: makeQueueDriver(firebase.database().ref())
  }

const dispose = Cycle.run(main, drivers)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    dispose()
  })
}
