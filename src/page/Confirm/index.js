import xs from 'xstream'
import delay from 'xstream/extra/delay'
import {combine} from 'util'
import {Profiles} from 'remote'

import {SoloFrame} from 'component/layout'
import ProfileForm from 'component/ProfileForm'
import Card from 'component/material/Card'
import SubmitAndCancelButtons from 'component/form/SubmitAndCancelButtons'
import {LargeAvatar} from 'component/sparks/Avatar'

import {div} from '@cycle/dom'
import {prop, applySpec, path, compose, trim, not} from 'ramda'

const _fromAuthData$ = sources =>
  sources.auth$
  .filter(Boolean)
  .map(path(['providerData', '0']))
  .map(applySpec({
    uid: prop('uid'),
    fullName: compose(trim, prop('displayName')),
    email: prop('email'),
    portraitUrl: prop('photoURL'),
  }))

export default sources => {
  const authProfile$ = _fromAuthData$(sources)

  const portraitUrl$ = authProfile$.map(prop('portraitUrl'))

  const pic = LargeAvatar({...sources,
    src$: portraitUrl$,
  })

  const profileForm = ProfileForm({item$: authProfile$, ...sources})

  const profile$ = combine(
      profileForm.item$,
      portraitUrl$
    )
    .map(([p, portraitUrl]) => ({...p, portraitUrl}))
    .remember()

  const submitAndCancel = SubmitAndCancelButtons({
    ...sources,
    enabled$: profileForm.valid$,
  })

  const queue$ = submitAndCancel.submit$
    .mapTo(profile$)
    .flatten()
    .map(Profiles.action.create)

  const cardDOM = Card({
    ...sources,
    size: {
      s: 12,
      l: 6,
    },
    margin: {
      l: 3,
    },
    content$: combine(pic.DOM, profileForm.DOM, submitAndCancel.DOM)
      .map(doms => div(doms)),
  }).DOM

  const frameDOM = cardDOM.map(dom => SoloFrame(div(), dom)).remember()
  // TODO: [JDW] why doesn't this stuff work without this listener!
  sources.log('fd', frameDOM)

  const DOM = sources.userProfile$
   .filter(not)
   .mapTo(frameDOM)
   .flatten()
   .remember()

  const router = sources.userProfile$
    .filter(Boolean)
    .mapTo('/')

  return {
    DOM,
    queue$,
    router,
  }
}
