import xs from 'xstream'
import isolate from '@cycle/isolate'
import firebase from 'firebase'
import {propEq, ifElse, identity, always} from 'ramda'
import {div, h1, button} from '@cycle/dom'

const actionEq = propEq('action')

function Landing ({DOM, auth$}) {
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')

  const intent$ = xs.merge(
    DOM.select('.google-login').events('click').mapTo({action: 'login'}),
    DOM.select('.google-logout').events('click').mapTo({action: 'logout'})
  )

  const login$ = intent$.filter(actionEq('login'))
    .mapTo({type: 'popup', provider})

  const logout$ = intent$.filter(actionEq('logout'))
    .mapTo({type: 'logout', provider})

  const loggedOutView = always(div([
    h1('.welcome', 'Sparks.Network'),
    button('.google-login', 'Login with Google'),
  ]))

  const loggedInView = (user) => div([
    div('.logged-in', `Logged in as ${user.providerData[0].email}`),
    div([
      button('.google-logout', {polyglot: {phrase: 'logout', name: 'Logout'}}),
    ]),
  ])

  const view$ = auth$.startWith(undefined)
    .map(ifElse(identity, loggedInView, loggedOutView))

  const queue$ = auth$
    .filter(identity)
    .map(user => ({
      domain: 'Profiles',
      action: 'create',
      ...user.providerData[0],
    }))

  return {
    DOM: view$,
    auth$: xs.merge(login$, logout$),
    queue$,
  }
}

export default sources => isolate(Landing)(sources)
