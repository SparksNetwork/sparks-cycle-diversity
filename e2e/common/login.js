const URL = 'http://localhost:8080'

export const USERNAME = process.env.TEST_ACCOUNT_EMAIL.trim()
export const PASSWORD = process.env.TEST_ACCOUNT_PASSWORD.trim()

export function login (browser) {
  return browser.url(URL)
    .waitForElementVisible('body')
    .assert.visible('.google-login')
    .click('.google-login')
    .click('.google-login')
    .window_handles(result => {
      browser.switchWindow(result.value[1])
        .waitForElementVisible('#Email')
        .setValue('#Email', USERNAME)
        .click('#next')
        .waitForElementVisible('#Passwd')
        .setValue('#Passwd', PASSWORD)
        .click('#signIn')
    })
    .window_handles(result => {
      browser.switchWindow(result.value[0])
    })
    .pause(5000)
}
