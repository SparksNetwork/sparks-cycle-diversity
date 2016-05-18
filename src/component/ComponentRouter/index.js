import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {eqProps, prop, reduce} from 'ramda'

import {requireSources} from 'util/index'

const equalPaths = eqProps('path')
const loading = div('.loading', 'Loading...')

function callComponent (sources) {
  return function ({path, value}) {
    const component = value({...sources, router: sources.router.path(path)})
    return {
      ...component,
      DOM: component.DOM.startWith(loading)
    }
  }
}

function reduceSinks (component$) {
  return function (acc, key) {
    acc[key] = component$.map(prop(key)).flatten()
    return acc
  }
}

function ComponentRouter (sources) {
  requireSources('ComponentRouter', sources, 'routes$')

  const component$ = sources.routes$
    .map(routes => sources.router.define(routes)).flatten()
    .compose(dropRepeats(equalPaths))
    .map(callComponent(sources))

  return {
    pluck: key => component$.map(prop(key)).flatten(),
    DOM: component$.map(prop('DOM')).flatten(),
    ...reduce(reduceSinks(component$), {}, ['auth$', 'queue$', 'route$'])
  }
}

export default sources => isolate(ComponentRouter)(sources)
