import {div, span} from '@cycle/dom'
import {classMap} from 'util'
import styles from './loader.scss'

const Loader = () =>
  div({class: classMap(['loader'], styles)}, [
    span('.icon-spinner', {class: classMap(['spinner'], styles)}),
  ])

export default Loader
