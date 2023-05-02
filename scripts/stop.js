#!/usr/bin/env node

import { Say } from '../index.js'

let say = new Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning stop...')

try {
  say.speak('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus orci odio. Sed ornare est nisi, sit amet varius odio mollis vitae. Fusce commodo orci quis consectetur posuere. In a felis ac eros. ', undefined, undefined)
} catch (e) {
  console.log(e)
}

setTimeout(() => {
  console.log('Stopping...')
  try {
    say.stop()
  } catch (e) {
    console.log(e)
  }
  console.log('Stopped!')
}, 2000)
