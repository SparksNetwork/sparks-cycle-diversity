const START_PROCESS = process.env.E2E !== 'CBT'

module.exports = {
  src_folders: ['e2e'],
  output_folder: './report',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: '',
  globals_path: '',

  selenium: {
    start_process: START_PROCESS,
    server_path: 'node_modules/selenium-server/lib/runner/selenium-server-standalone-2.53.0.jar',
    log_path: '',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
      'webdriver.ie.driver': ''
    }
  },

  test_runner: {
    type: 'mocha',
    options: {
      reporter: 'mocha-circleci-reporter'
    }
  },

  test_settings: {
    local: {
      launch_url: 'http://localhost:8080',
      selenium_port: 4444,
      selenium_host: 'localhost',
      output_folder: './report',
      screenshots: {
        enabled: true,
        path: './screens',
        on_failure: true,
        on_error: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    default: {
      launch_url: 'http://ondemand.saucelabs.com:80',
      selenium_port: 80,
      selenium_host: 'ondemand.saucelabs.com',
      silent: true,
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      screenshots: {
        enabled: false,
        path: ''
      },
      globals: {
        waitForConditionTimeout: 10000
      }
    }
  }
}
