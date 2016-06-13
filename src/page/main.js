import 'normalize-css'

// Globals
import xs from 'xstream'
import {log} from 'util'
import {not, compose, head, takeLast, flip, append, prop} from 'ramda'
import dropRepeats from 'xstream/extra/dropRepeats'

// Pages
import Landing from './Landing'
import Confirm from './Confirm'

// Components
import MiddlewareRouter from 'component/MiddlewareRouter'

const routes =
  {
    '/': Landing,
    '/confirm': Confirm,
  }

const UserMiddleware = (sources, next) => {
  const userProfileKey$ = sources.auth$
    .map(auth =>
      auth ? sources.firebase('Users', auth.uid) : xs.of(null))
    .flatten()
    .remember()

  const userProfile$ = userProfileKey$
    .compose(dropRepeats())
    .map(key =>
      key ? sources.firebase('Profiles', key) : xs.of(null))
    .flatten()
    .remember()

  return next({
    ...sources,
    userProfile$,
    userProfileKey$,
  })
}

const StoreRouteMiddleware = (sources, next) => {
  const paths$ = sources.router.history$
    .map(prop('pathname'))
    .compose(dropRepeats())
    .fold(flip(append), '/')
    .remember()

  return next({
    ...sources,
    previousRoute$: paths$.map(compose(head, takeLast(2))),
  })
}

const AuthMiddleware = (_sources, next) => {
  const sources = next(_sources)

  return {
    ...sources,
    router: xs.merge(
      _sources.auth$.filter(not)
        .mapTo('/landing'),
      _sources.auth$
        .filter(Boolean)
        .map(auth =>
          _sources.userProfile$
            .filter(not)
            .mapTo('/confirm')
        )
        .flatten(),
      sources.router
    ),
  }
}

const AuthedQueueMiddleware = (_sources, next) => {
  const sources = next(_sources)

  return {
    ...sources,
    queue$: _sources.auth$.map(auth =>
      sources.queue$
        .debug(_sources.log('queue$ unauth'))
        .map(action =>
          ({...action, uid: auth.uid})
        )
    )
    .flatten()
    .debug(_sources.log('queue$ authed')),
  }
}

const LoggingMiddleware = name => (sources, next) => { // eslint-disable-line
  console.log('before', name, sources)
  const newS = next(sources)
  console.log('after', name, newS)
  return newS
}

export default function main (_sources) {
  const sources = {
    ..._sources,
    log,
    routes$: xs.of(routes),
  }

  const middleware = [
    UserMiddleware,
    StoreRouteMiddleware,
    AuthMiddleware,
    AuthedQueueMiddleware,
  ]

  return MiddlewareRouter(middleware)(sources)
}
