import {h} from '@cycle/dom'
import {gridClasses} from 'component/material/grid'

const SoloFrame = (header, page) =>
  h(
    'main',
    {
      class: gridClasses({size: {l: 12}}),
    },
    [header, page]
  )

export default SoloFrame
