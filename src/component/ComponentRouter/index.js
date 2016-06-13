import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {eqProps, prop, propOr} from 'ramda'

import {requireSources} from 'util/index'
import Loader from 'component/Loader'

const equalPaths = eqProps('path')
const loading = Loader()

const callComponent = sources => ({path, value}) => {
  const component = value({...sources, router: sources.router.path(path)})
  return {
    ...component,
    DOM: component.DOM.startWith(loading),
  }
}

function ComponentRouter (sources) {
  requireSources('ComponentRouter', sources, 'routes$')

  const component$ = sources.routes$
    .map(routes => sources.router.define(routes))
    .flatten()
    .compose(dropRepeats(equalPaths)) // dont render the same page twice in a row
    .map(callComponent(sources))
    .remember()

  const pluck = key => component$
    .map(propOr(xs.empty(), key))
    .flatten()

  return {
    pluck: pluck,
    DOM: component$.map(prop('DOM')).flatten(),
    router: pluck('router'),
    auth$: pluck('auth$'),
    queue$: pluck('queue$'),
  }
}

export default sources => isolate(ComponentRouter)(sources)
