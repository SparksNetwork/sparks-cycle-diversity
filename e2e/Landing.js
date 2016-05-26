const URL = process.env.E2E && process.env.E2E.trim() === 'CBT'
  ? 'http://local/200.html'
  : 'http://localhost:8080'

const {describe, it, after} = global

describe('Landing page', () => {
  after((client, done) => {
    client.end(() => {
      done()
    })
  })

  it('should show a welcoming', (browser) => {
    browser
      .url(URL)
      .waitForElementVisible('body', 2000)
      .assert.containsText('.welcome', 'Sparks.Network')
      .end()
  })
})
