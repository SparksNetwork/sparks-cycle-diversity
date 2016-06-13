import {img} from '@cycle/dom'
import {objOf} from 'ramda'
import styles from './styles.scss'

const Avatar = sources => ({
  DOM: sources.src$.map(src =>
    img({class: objOf(styles[sources.className], true), attrs: {src}})),
})

const SmallAvatar = sources => Avatar({...sources, className: 'small'})
const MediumAvatar = sources => Avatar({...sources, className: 'medium'})
const LargeAvatar = sources => Avatar({...sources, className: 'large'})

export {
  SmallAvatar,
  MediumAvatar,
  LargeAvatar,
}
