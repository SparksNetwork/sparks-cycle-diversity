import {div} from '@cycle/dom'
import {gridClasses} from './grid'

const DivBuilder = classes => sources => {
  const vtree$ = sources.content$.map(content =>
    div('.' + classes, {class: gridClasses(sources)}, [content]))

  return {
    DOM: vtree$,
  }
}

export default DivBuilder
