const SayPlatformBase = require('./base.js')
const childProcess = require('child_process')

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

  async getVoices () {
    let voices = []
    let command = 'say'
    let args = ['-v', '?']

    this.child = childProcess.spawn(command, args)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    return new Promise((resolve, reject) => {
      this.child.stderr.once('data', (data) => {
        // we can't stop execution from this function
        reject(new Error(data))
      })
      this.child.stdout.on('data', function (data) {
        voices += data
      })

      this.child.addListener('exit', (code, signal) => {
        if (code === null || signal !== null) {
          reject(new Error(`say.getInstalledVoices(): could not get installed voices, had an error [code: ${code}] [signal: ${signal}]`))
        }
        // console.log('voices', voices)
        if (voices.length > 0) {
          let test = /([A-Za-z]+)\s*([A-Za-z]+_[A-Za-z]+)/g

          let matches = voices.matchAll(test)

          voices = []
          for (const match of matches) {
            voices.push(`${match[1]} (${match[2]})`)
          }
        }
        this.child = null

        resolve(voices)
      })
    })
  }
}

module.exports = SayPlatformDarwin
