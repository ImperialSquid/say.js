#!/usr/bin/env node

import { Say } from '../index.js'

let say = new Say(undefined, true) // set debug to true

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
