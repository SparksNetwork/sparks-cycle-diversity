import xs from 'xstream'
import {button, span} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {combineObj, classMap} from 'util'
import {objOf, merge, not} from 'ramda'
import styles from 'surface/buttons.scss'
import custom from './buttons.scss'

const defaultBehaviour = ({type, color, phrase, clicked, enabled}) =>
    button({
      class: classMap([`btn--${type}`, `btn--${color}`], styles),
      props: {
        disabled: not(enabled),
      },
      polyglot: {phrase},
    })

export const loaderOnClickBehaviour = args => {
  return span({
    class: merge(
      objOf(custom.loading, args.clicked),
      objOf(custom.loader, true)
    )}, [
      defaultBehaviour(args),
      span('.icon-spinner', {
        class: classMap(['spinner'], custom),
      }),
    ])
}

const Button = sources => {
  const click$ = sources.DOM
    .select('button')
    .events('click')

  const behaviour = sources.behaviour || defaultBehaviour

  const DOM = combineObj({
    type: sources.type$ || xs.of('flat'),
    color: sources.color$ || xs.of('primary'),
    phrase: sources.phrase$ || xs.of('button'),
    clicked: click$.mapTo(true).startWith(false),
    enabled: sources.enabled$ || xs.of(true),
  }).map(behaviour)

  return {
    DOM,
    click$,
  }
}

const isolated = sources => isolate(Button)(sources)
export default isolated
