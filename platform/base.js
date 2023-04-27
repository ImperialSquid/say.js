const childProcess = require('child_process')

class SayPlatformBase {
  constructor () {
    this.child = null
    this.baseSpeed = 0
    this.debug = false
  }

  /**
   * Uses system libraries to speak text via the speakers.
   *
   * @param {string} text Text to be spoken
   * @param {string|null} voice Name of voice to be spoken with
   * @param {number|null} speed Speed of text (e.g. 1.0 for normal, 0.5 half, 2.0 double)
   * @param {Function|null} callback A callback of type function(err) to return.
   */
  async speak (text, voice, speed) {
    if (!text) {
      return setImmediate(() => {
        throw new TypeError('say.speak(): must provide text parameter')
      })
    }

    let { command, args, pipedData, options } = this.buildSpeakCommand({ text, voice, speed })

    if (this.debug) {
      console.log('command: ' + command)
      console.log('args: ' + args)
      console.log('pipedData: ' + pipedData)
      console.log('options:\n  ' + Object.keys(options).map((key) => `${key}: ${options[key]}`).join(' \n'))
    }

    this.child = childProcess.spawn(command, args, options)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    if (pipedData) {
      this.child.stdin.end(pipedData)
    }

    this.child.stderr.once('data', (data) => {
      // we can't stop execution from this function
      throw new Error(data)
    })

    this.child.addListener('exit', (code, signal) => {
      if (code === null || signal !== null) {
        throw new Error(`say.speak(): could not talk, had an error [code: ${code}] [signal: ${signal}]`)
      }

      this.child = null

      return null
    })
  }

  /**
   * Uses system libraries to speak text via the speakers.
   *
   * @param {string} text Text to be spoken
   * @param {string|null} voice Name of voice to be spoken with
   * @param {number|null} speed Speed of text (e.g. 1.0 for normal, 0.5 half, 2.0 double)
   * @param {string} filename Path to file to write audio to, e.g. "greeting.wav"
   * @param {Function|null} callback A callback of type function(err) to return.
   */
  async export (text, voice, speed, filename) {
    if (!text) {
      return setImmediate(() => {
        throw new TypeError('say.export(): must provide text parameter')
      })
    }

    if (!filename) {
      return setImmediate(() => {
        throw new TypeError('say.export(): must provide filename parameter')
      })
    }

    try {
      var { command, args, pipedData, options } = this.buildExportCommand({ text, voice, speed, filename })
    } catch (error) {
      return setImmediate(() => {
        throw error
      })
    }

    this.child = childProcess.spawn(command, args, options)

    this.child.stdin.setEncoding('ascii')
    this.child.stderr.setEncoding('ascii')

    if (pipedData) {
      this.child.stdin.end(pipedData)
    }

    this.child.stderr.once('data', (data) => {
      // we can't stop execution from this function
      throw new Error(data)
    })

    this.child.addListener('exit', (code, signal) => {
      if (code === null || signal !== null) {
        throw new Error(`say.export(): could not talk, had an error [code: ${code}] [signal: ${signal}]`)
      }

      this.child = null

      return null
    })
  }

  /**
   * Stops currently playing audio. There will be unexpected results if multiple audios are being played at once
   *
   * TODO: If two messages are being spoken simultaneously, childD points to new instance, no way to kill previous
   *
   * @param {Function|null} callback A callback of type function(err) to return.
   */
  async stop () {
    if (!this.child) {
      return setImmediate(() => {
        throw new Error('say.stop(): no speech to kill')
      })
    }

    this.runStopCommand()

    this.child = null

    return null
  }

  convertSpeed (speed) {
    return Math.ceil(this.baseSpeed * speed)
  }

  /**
   * Get Installed voices on system
   * @param {Function} callback A callback of type function(err,voices) to return.
   */
  async getInstalledVoices () {
    return this.getVoices()
  }
}

module.exports = SayPlatformBase
