#!/usr/bin/env node

let sayModule = require('../')

let say = new sayModule.Say(undefined, true) // set debug to true

console.log('Say object:')
Object.keys(say).forEach((prop) =>
  console.log(prop, say[prop])
)

console.log('Beginning stop...')

say.speak('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non dolor nulla. Quisque non nisl in ante fringilla porttitor euismod quis nulla. Integer fringilla lacus at elit vestibulum finibus. Nunc sagittis ipsum eu tincidunt tristique. Cras in mauris nisi. Duis id convallis dolor, consectetur mollis turpis. Fusce interdum magna ut erat aliquam posuere. Fusce posuere efficitur ex, vel mollis mauris convallis ac. In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras porttitor venenatis sollicitudin. Suspendisse varius, nulla rutrum porttitor tempus, augue sapien blandit nulla, mollis faucibus justo mi at purus. Cras hendrerit urna a mollis sollicitudin. Donec tempus lorem metus, quis mattis dui facilisis vel. ', undefined, undefined, (error) => {
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
