import {div} from '@cycle/dom'

const ImportantTip = message =>
  div({
    style: {
      textAlign: 'center',
      margin: '0.5em 1em',
      fontSize: '1.3em',
      color: 'red',
      fontWeight: 'bold',
    },
  }, [message])

export default ImportantTip
