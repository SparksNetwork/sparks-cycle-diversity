import xs from 'xstream'
import {omit} from 'ramda'
import {combine} from 'util'
import {span} from '@cycle/dom'
import Button, {loaderOnClickBehaviour} from 'component/material/Button'

const SubmitAndCancelButtons = sources => {
  const submit = Button({
    ...sources,
    behaviour: loaderOnClickBehaviour,
    phrase$: sources.submitPhrase$ || xs.of('submit'),
  })

  const cancel = Button({
    ...omit(['enabled$'], sources),
    phrase$: sources.submitPhrase$ || xs.of('cancel'),
    color$: xs.of('secondary'),
  })

  return {
    DOM: combine(submit.DOM, cancel.DOM).map(span),
    submit$: submit.click$,
    cancel$: cancel.click$,
  }
}

export default SubmitAndCancelButtons
