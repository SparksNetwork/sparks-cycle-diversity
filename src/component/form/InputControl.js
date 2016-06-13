import xs from 'xstream'
import {combine} from 'util'
import {div, input, label} from '@cycle/dom'
import {path, always, objOf} from 'ramda'
import styles from 'surface/form.scss'
import custom from './input.scss'

const InputControl = sources => {
  const input$ = sources.DOM.select('.input').events('input')
  const key$ = sources.DOM.select('.input').events('keydown')

  const value$ = xs.merge(
    (sources.value$ || xs.of(null)),
    input$.map(path(['target', 'value']))
  )

  const valid$ = value$
    .map(sources.validation || always(true))
    .remember()

  const type = sources.type || 'text'

  const DOM = combine(
      sources.phrase$ || xs.of(null),
      value$,
      valid$
    )
    .map(([phrase, value, valid]) =>
      div({}, [
        label({polyglot: {phrase}}),
        input('.input.text', {
          class: objOf(custom.validated, sources.validation || sources.required),
          attrs: {
            type: type,
          },
          props: {
            value: value,
            required: sources.required || false,
          },
        }),
      ])
    )

  return {
    DOM,
    value$,
    valid$,
    key$,
  }
}

export default InputControl
