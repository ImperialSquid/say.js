#!/usr/bin/env node

import { Say } from '../index.js'

let say = new Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning speak...')

say.speak('What are you doing?', undefined, undefined)

console.log('Done')
