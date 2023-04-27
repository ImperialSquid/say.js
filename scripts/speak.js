#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning speak...')

say.speak('What are you doing?', undefined, undefined)

console.log('Done')
