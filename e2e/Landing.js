const URL = 'localhost:8080'

const {describe, it} = global

describe('Landing page', () => {
  it('should show a welcoming', (browser) => {
    browser
      .url(URL)
      .waitForElementVisible('body')
      .assert.containsText('.welcome', 'Sparks.Network')
      .end()
  })
})
