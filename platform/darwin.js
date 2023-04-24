const SayPlatformBase = require('./base.js')
const childProcess = require('child_process')
const once = require('one-time')

const BASE_SPEED = 175
const COMMAND = 'say'

class SayPlatformDarwin extends SayPlatformBase {
  constructor (debug) {
    super()
    this.baseSpeed = BASE_SPEED
    this.debug = debug
  }

  buildSpeakCommand ({ text, voice, speed }) {
    let args = []
    let pipedData = ''
    let options = {}

    if (!voice) {
      args.push(text)
    } else {
      args.push('-v', voice, text)
    }

    if (speed) {
      args.push('-r', this.convertSpeed(speed))
    }

    return { command: COMMAND, args, pipedData, options }
  }

  buildExportCommand ({ text, voice, speed, filename }) {
    let args = []
    let pipedData = ''
    let options = {}

    if (!voice) {
      args.push(text)
    } else {
      args.push('-v', voice, text)
    }

    if (speed) {
      args.push('-r', this.convertSpeed(speed))
    }

    if (filename) {
      args.push('-o', filename, '--data-format=LEF32@32000')
    }

    return { command: COMMAND, args, pipedData, options }
  }

  runStopCommand () {
    this.child.stdin.pause()
    this.child.kill()
  }

  getVoices (callback) {
    if (typeof callback !== 'function') {
      callback = () => {}
    }
    callback = once(callback)

    let voices = []
    let command = 'say'
    let args = ['-v', '?']

    this.child = childProcess.spawn(command, args)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    this.child.stderr.once('data', (data) => {
      // we can't stop execution from this function
      callback(new Error(data))
    })
    this.child.stdout.on('data', function (data) {
      voices += data
    })

    this.child.addListener('exit', (code, signal) => {
      if (code === null || signal !== null) {
        return callback(new Error(`say.getInstalledVoices(): could not get installed voices, had an error [code: ${code}] [signal: ${signal}]`))
      }
      console.log('voices', voices)
      if (voices.length > 0) {
        voices = voices.split('\r\n')
        voices = (voices[voices.length - 1] === '') ? voices.slice(0, voices.length - 1) : voices
      }
      this.child = null

      callback(null, voices)
    })
  }
}

module.exports = SayPlatformDarwin
