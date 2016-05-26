const URL = process.env.E2E && process.env.E2E.trim() === 'CBT'
  ? 'http://local/200.html'
  : 'http://localhost:8080'

export const USERNAME = process.env.TEST_ACCOUNT_EMAIL.trim()
export const PASSWORD = process.env.TEST_ACCOUNT_PASSWORD.trim()

export function login (browser) {
  return browser.url(URL)
    .waitForElementVisible('body', 3000)
    .assert.visible('.google-login')
    .click('.google-login')
    .window_handles(result => {
      browser.switchWindow(result.value[1])
        .waitForElementVisible('#Email', 3000)
        .setValue('#Email', USERNAME)
        .click('#next')
        .waitForElementVisible('#Passwd', 3000)
        .setValue('#Passwd', PASSWORD)
        .click('#signIn')
    })
    .window_handles(result => {
      browser.switchWindow(result.value[0])
    })
}
