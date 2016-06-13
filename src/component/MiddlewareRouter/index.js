import ComponentRouter from 'component/ComponentRouter'
import {compose, reduceRight, map, curryN, flip} from 'ramda'

const MiddlewareRouter = middleware => {
  const runMiddleware = compose(
    reduceRight(
      (acc, fn) => fn(acc),
      ComponentRouter
    ),
    map(curryN(2)),
    map(flip)
  )

  return runMiddleware(middleware)
}

export default MiddlewareRouter
