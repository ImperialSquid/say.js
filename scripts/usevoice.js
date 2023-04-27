#!/usr/bin/env node

let sayModule = require('../index')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Getting voices...')

let p1 = say.getInstalledVoices()

let p2 = Promise.all([p1]).then((v) => {
  console.log(`Found ${v[0].length} voices`)
  console.log('Using voice: ', v[0][0])
  say.speak('What are you doing?', v[0][0], undefined)
}).catch(console.error)

Promise.all([p1, p2]).then((v) => {
  console.log('Done!')
}).catch(console.error)
