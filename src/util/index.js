import xs, {Stream} from 'xstream'
import {forEach, map, propOr, keys, filter, without, merge, zipObj, props, fromPairs, compose, flip, pair, flatten} from 'ramda'

export function requireSources (componentName, sources, ...sourcesNames) {
  forEach(n => {
    if (!sources[n]) {
      throw new Error(`${componentName} must have ${n} specified`)
    }
  }, sourcesNames)
}

export function subscribe (fn) {
  const listener = {
    next: item => fn(item),
    error: () => {},
    complete: () => {},
  }

  return stream => {
    stream.addListener(listener)
    return () => stream.removeListener(listener)
  }
}

export function logStream (stream) {
  return subscribe(item => console.log(item))(stream)
}

export function isStream (stream) {
  return stream instanceof Stream
}

export function log (name, ...streams) {
  if (streams.length > 0) {
    const sub = subscribe(item => console.log(name, item))
    return streams.map(stream => sub(stream))
  } else {
    return item => console.log(name, item)
  }
}

const propOrNever = propOr(xs.never())
export function mergeFlatten (key, children) {
  return xs.merge(
    ...map(child => isStream(child)
      ? child.map(propOrNever(key)).flatten()
      : propOrNever(key, child)
      , children
    )
  )
}

/**
 * Implement combine as per xstream 5, returning an array
 *
 * @param {...Stream<T> | Array<Stream<T>>} streamsOrArrays An array of streams OR
 *   an argument list of streams
 * @return {Stream<Array<T>>} A stream of arrays of values
 */
export function combine (...streamsOrArrays) {
  let streams

  if (isStream(streamsOrArrays[0])) {
    streams = streamsOrArrays
  } else {
    streams = streamsOrArrays[0]
  }

  const mapper = (...items) => {
    return items
  }

  return xs.combine(...streams)
}

/**
 * Take an object where the values are streams and combines those streams,
 * returning a stream that emits an object with all of the input keys
 */
export function combineObj (obj) {
  const names = keys(obj)
  const combineNames = filter(name => isStream(obj[name]))(names)
  const otherNames = without(combineNames, names)

  const staticValues = props(otherNames, obj)
  const streams = combineNames.map(name => obj[name])

  return combine(...streams)
    .map(combinedValues =>
    merge(
      staticValues,
      zipObj(combineNames, combinedValues)
    ))
}

/*
* Convert an array of class names to a snabbdom suitable class map where the
* className is the key an true is the value. Maps using the given styles
*
* @param {Array<String>} classes array of class names
* @param {...Object<String,String>} styleMaps map of global to local class names
* @return {Object<String,true>}
*/
export function classMap (classes, ...styleMaps) {
  return compose(
    fromPairs,
    map(flip(pair)(true)),
    flatten,
    map(className => map(styles => styles[className], styleMaps))
  )(classes)
}
