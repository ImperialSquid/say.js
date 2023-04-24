#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true)

Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('about to speak...')

say.speak('What are you doing?', undefined, undefined, (error) => {
  if (error) {
    return console.error(error)
  }

  console.log('done')
})
