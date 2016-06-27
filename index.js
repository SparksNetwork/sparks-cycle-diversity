import fs from 'fs'
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

const compileHtml = () => {
  const indexSource = fs.readFileSync('./dist/index.html',
    {encoding: 'utf-8'})
  return indexSource
}

const html = compileHtml()

app.get('*', (req, res) => {
  if (env === 'development') {
    res.send(compileHtml())
  } else {
    res.send(html)
  }
})

app.listen(port, () => console.log(`Listening on ${port}`))

export default app
