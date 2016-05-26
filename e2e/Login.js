const {describe, it, after} = global

import {login, USERNAME} from './common/login'

describe('Logging in with Firebase', () => {
  after((client, done) => {
    client.end(() => {
      done()
    })
  })

  it('should render email after logging in', (browser) => {
    login(browser)
      .pause(2000)
      .assert.containsText('.logged-in', `Logged in as ${USERNAME}`)
  })

  it('should display a log out button after loggin in', (browser) => {
    browser
      .pause(200)
      .assert.containsText('.google-logout', 'logout')
  })
})
