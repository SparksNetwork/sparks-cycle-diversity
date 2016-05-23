import 'es6-shim' // suppport more browsers
// External imports
import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeRouterDriver, supportsHistory} from 'cyclic-router'
import {createHistory, createHashHistory} from 'history'

// Local imports
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
    router: makeRouterDriver(...history)
  }

const dispose = Cycle.run(main, drivers)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    dispose()
  })
}
