#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning stop...')

say.getInstalledVoices((error, voices) => {
  if (error) {
    return console.error(error)
  }

  console.log(voices[0])
})
