const {describe, it} = global

import {login, USERNAME} from '../common/login'

describe('Logging in with Firebase', function () {
  this.retries = 2
  it('should render email after logging in', (browser) => {
    login(browser)
      .assert.containsText('.logged-in', `Logged in as ${USERNAME}`)
  })

  it('should display a log out button after logging in', (browser) => {
    browser
      .pause(1000)
      .assert.containsText('.google-logout', 'logout')
      .end()
  })
})
