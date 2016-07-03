import dropRepeats from 'xstream/extra/dropRepeats'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {eqProps, prop} from 'ramda'

import {requireSources} from 'util/index'

const equalPaths = eqProps('path')

import styles from './index.scss'
const loading = div('.' + styles.loading, {}, 'Loading...')

const callComponent = sources => ({path, value}) => {
  const component = value({...sources, router: sources.router.path(path)})
  return {
    ...component,
    DOM: component.DOM.startWith(loading)
  }
}

function ComponentRouter (sources) {
  requireSources('ComponentRouter', sources, 'routes$')

  const component$ = sources.routes$
    .map(routes => sources.router.define(routes)).flatten()
    .compose(dropRepeats(equalPaths)) // dont render the same page twice in a row
    .map(callComponent(sources))
    .remember()

  return {
    pluck: key => component$.map(prop(key)).flatten(),
    DOM: component$.map(prop('DOM')).flatten(),
    route$: component$.map(prop('route$')).flatten(),
    auth$: component$.map(prop('auth$')).flatten(),
    queue$: component$.map(prop('queue$')).flatten()
  }
}

export default sources => isolate(ComponentRouter)(sources)
