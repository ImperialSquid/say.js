#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning stop...')

say.speak('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus orci odio. Sed ornare est nisi, sit amet varius odio mollis vitae. Fusce commodo orci quis consectetur posuere. In a felis ac eros. ', undefined, undefined, (error) => {
  if (error) {
    return console.error(error)
  }
})

setTimeout(() => {
  console.log('Stopping...')
  say.stop((error) => {
    if (error) {
      return console.error(error)
    }
    console.log('Stopped!')
  })
}, 2000)
