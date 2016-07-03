require('babel-register')

const config = process.env.LOCAL
  ? require('./nightwatch_local.json')
  : require('./nightwatch_sauce.json')

module.exports = (function (settings) {
  if (process.platform === 'win32') {
    settings.selenium.cli_args['webdriver.chrome.driver'] =
      './node_modules/.bin/chromedriver.cmd'
  }
  return settings
})(config)
