#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Getting voices...')

say.getInstalledVoices((error, voices) => {
  if (error) {
    return console.error(error)
  }

  // print number of voices
  console.log(`Got ${voices.length} voices:`)
  console.log(voices)
})
