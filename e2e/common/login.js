const URL = 'http://localhost:8080'

export const USERNAME = process.env.TEST_ACCOUNT_EMAIL.trim()
export const PASSWORD = process.env.TEST_ACCOUNT_PASSWORD.trim()

export function login (browser) {
  return browser.url(URL)
    .waitForElementVisible('.google-login', Infinity)
    .click('.google-login')
    .click('.google-login') // double click required for saucelabs to focus and actually click
    .waitForElementVisible('#Email', Infinity)
    .setValue('#Email', USERNAME)
    .click('#next')
    .waitForElementVisible('#Passwd')
    .setValue('#Passwd', PASSWORD)
    .click('#signIn')
    .window_handles(result => {
      browser.switchWindow(result.value[0])
    })
    .pause(5000)
}
