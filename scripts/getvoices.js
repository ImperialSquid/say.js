#!/usr/bin/env node

let sayModule = require('../index')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Getting voices...')

let p1 = say.getInstalledVoices()
let voices = []

Promise.all([p1]).then((v) => { voices = v[0] }).catch(console.error)

setTimeout(() => {
  console.log(`Found ${voices.length} voices`)
  console.log('Voices:', voices)
}, 1000)
