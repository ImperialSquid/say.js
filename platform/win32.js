import childProcess from 'child_process'

import { SayPlatformBase } from './base.js'

const BASE_SPEED = 0 // Unsupported
const COMMAND = 'powershell'

export class SayPlatformWin32 extends SayPlatformBase {
  constructor (debug) {
    super()
    this.baseSpeed = BASE_SPEED
    this.debug = debug
  }

  buildSpeakCommand ({ text, voice, speed }) {
    let args = []
    let pipedData = ''
    let options = {}

    let psCommand = `Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;`

    if (voice) {
      psCommand += `$speak.SelectVoice('${voice}');`
    }

    if (speed) {
      let adjustedSpeed = this.convertSpeed(speed || 1)
      psCommand += `$speak.Rate = ${adjustedSpeed};`
    }

    psCommand += `$speak.Speak([Console]::In.ReadToEnd())`

    pipedData += text
    args.push(psCommand)
    options.shell = true

    return { command: COMMAND, args, pipedData, options }
  }

  buildExportCommand ({ text, voice, speed, filename }) {
    let args = []
    let pipedData = ''
    let options = {}

    let psCommand = `Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;`

    if (voice) {
      psCommand += `$speak.SelectVoice('${voice}');`
    }

    if (speed) {
      let adjustedSpeed = this.convertSpeed(speed || 1)
      psCommand += `$speak.Rate = ${adjustedSpeed};`
    }

    if (!filename) throw new Error('Filename must be provided in export();')
    else {
      psCommand += `$speak.SetOutputToWaveFile('${filename}');`
    }

    psCommand += `$speak.Speak([Console]::In.ReadToEnd());$speak.Dispose()`

    pipedData += text
    args.push(psCommand)
    options.shell = true

    return { command: COMMAND, args, pipedData, options }
  }

  runStopCommand () {
    this.child.stdin.pause()
    childProcess.exec(`taskkill /pid ${this.child.pid} /T /F`)
  }

  convertSpeed (speed) {
    // Overriden to map playback speed (as a ratio) to Window's values (-10 to 10, zero meaning x1.0)
    return Math.max(-10, Math.min(Math.round((9.0686 * Math.log(speed)) - 0.1806), 10))
  }

  async getVoices () {
    let args = []
    let psCommand = 'Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;$speak.GetInstalledVoices() | % {$_.VoiceInfo.Name}'
    args.push(psCommand)
    let command = COMMAND
    var voices = []
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
        if (voices.length > 0) {
          voices = voices.split('\r\n')
          voices = (voices[voices.length - 1] === '') ? voices.slice(0, voices.length - 1) : voices
        }
        this.child = null

        resolve(voices)
      })

      this.child.stdin.end()
    })
  }
}
