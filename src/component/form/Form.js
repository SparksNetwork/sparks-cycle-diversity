import xs from 'xstream'
import isolate from '@cycle/isolate'
import {div} from '@cycle/dom'
import {prop, filter, compose, map, objOf, mergeAll, path, pathOr, all} from 'ramda'
import {combine, combineObj} from 'util'

const pluckStartValue = (item$, field) =>
  item$ && item$.map(prop(field)) || xs.of(null)

const _controlSources = (field, sources) => ({...sources,
  value$: xs.merge(
    (sources.value$ || sources.item$ && pluckStartValue(sources.item$, field) || xs.of({})),
    pluckStartValue(sources.item$, field)),
})

const Form = sources => {
  // sources.controls$ is an array of components

  // controls$ is array of the created components (sink collections technically)
  const controls$ = sources.controls$.map(controls =>
    controls.map(({field, control}) => ({
      field,
      control: isolate(control, field)({
        ...sources,
        value$: _controlSources(field, sources).value$,
      }),
    }))
  ).remember() // keeps it from being pwnd every time

  // item$ gets their values$
  const item$ = controls$
    .map(
      compose(
        combineObj,
        controls => mergeAll(...controls),
        map(({field, control}) => objOf(field, control.value$)),
        filter(prop('field'))
      )
    )
    .flatten()
    .remember()

  const DOM = controls$
    .map(map(path(['control', 'DOM'])))
    .map(combine)
    .flatten()
    .map(controls => div({}, controls))

  const valid$ = controls$
    .map(map(pathOr(xs.of(true), ['control', 'valid$'])))
    .map(combine)
    .flatten()
    .map(all(Boolean))
    .remember()

  return {
    DOM,
    item$,
    valid$,
  }
}

export default Form
