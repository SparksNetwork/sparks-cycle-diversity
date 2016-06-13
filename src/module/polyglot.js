import Polyglot from 'node-polyglot'

const userLanguage = navigator.language || navigator.userLanguage || 'en-US'

export function makePolyglotModule (translations) {
  const polyglot = new Polyglot()
  polyglot.extend(translations[userLanguage])

  function internationlizeTextContent (_, vNode) {
    const {phrase, ...data} = vNode.data.polyglot || {}
    if (!phrase) { return }
    vNode.elm.textContent = polyglot.t(phrase, data)
  }

  return {
    create: internationlizeTextContent,
    update: internationlizeTextContent,
  }
}
