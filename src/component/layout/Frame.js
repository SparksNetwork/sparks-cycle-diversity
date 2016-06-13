import {div, h, input, label, h4} from '@cycle/dom'

const Frame = (sideNav, header, page) =>
  div([
    input('#nav--super-vertical-responsive', {attrs: {type: 'checkbox'}}),
    label({attrs: {for: 'nav--super-vertical-responsive'}}, ['MENU']),
    h('aside', '.nav--super-vertical g--3 no-margin-vertical', [
      div('.g--12.logo-area.no-margin-vertical', [
        h4('.color--pink.no-margin-vertical', ['Sparks.Network']),
      ]),
      h('nav', '.g--12.no-margin-vertical', sideNav),
    ]),
    h('main', '.g--9.no-margin-vertical', [header, page]),
  ])

export default Frame
