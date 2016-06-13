import {ifElse, equals, always, join, map, merge, invertObj, mapObjIndexed, compose} from 'ramda'
import styles from 'surface/grid.scss'

const sizeKey = ifElse(equals('l'), always('g'), key => `g-${key}`)
const marginKey = ifElse(equals('l'), always('m'), key => `m-${key}`)

const mapClasses = mapFn => compose(
  map(always(true)),
  invertObj,
  map(className => styles[className] || console.error('cannot find class mapping for', className, 'from', styles)),
  mapObjIndexed((num, key, obj) =>
    join('--', [mapFn(key), num]))
)

export const sizeClasses = mapClasses(sizeKey)
export const marginClasses = mapClasses(marginKey)

export function gridClasses (sources) {
  const size = sources.size || {}
  const margin = sources.margin || {}

  return merge(
    sizeClasses(size),
    marginClasses(margin)
  )
}
