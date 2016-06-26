import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const port = process.env.PORT || 3000
const app = express()
const env = app.get('env')

if (env === 'development') {
  const webpackConfig = require('./webpack.config')
  const compiler = webpack(webpackConfig)
  const hot = webpackHotMiddleware(compiler)

  app.use(webpackDevMiddleware(compiler, webpackConfig.devServer))
  app.use(hot)
}

app.use(express.static('dist'))
app.listen(port, () => console.log(`Listening on ${port}`))

export default app
