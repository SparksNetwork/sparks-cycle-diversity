import xs from 'xstream'
import isolate from '@cycle/isolate'
import firebase from 'firebase'
import {propEq, ifElse, identity} from 'ramda'
import {div, h1, button} from '@cycle/dom'
import Button from 'component/material/Button'

const actionEq = propEq('action')

function Landing (sources) {
  const {auth$} = sources
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')

  const intent$ = xs.merge(
    sources.DOM.select('.google-login').events('click').mapTo({action: 'login'}),
    sources.DOM.select('.google-logout').events('click').mapTo({action: 'logout'})
  )

  const LoginButton = Button({
    ...sources,
    phrase$: xs.of('loginGoogle'),
  })

  const login$ = LoginButton.click$
    .mapTo({type: 'popup', provider})

  const logout$ = intent$.filter(actionEq('logout'))
    .mapTo({type: 'logout', provider})

  const loggedOutView = () =>
    LoginButton.DOM.map(button =>
      div([
        h1('.welcome', 'Sparks.Network'),
        button,
      ])
    )

  const loggedInView = (user) => xs.of(
    div([
      div('.logged-in', `Logged in as ${user.providerData[0].email}`),
      div([
        button('.google-logout', {polyglot: {phrase: 'logout', name: 'Logout'}}),
      ]),
    ])
  )

  const DOM = auth$.startWith(undefined)
    .map(ifElse(identity, loggedInView, loggedOutView))
    .flatten()

  const queue$ = auth$
    .filter(identity)
    .map(user => ({
      domain: 'Profiles',
      action: 'create',
      ...user.providerData[0],
    }))

  return {
    DOM,
    auth$: xs.merge(login$, logout$),
    queue$,
  }
}

export default sources => isolate(Landing)(sources)
