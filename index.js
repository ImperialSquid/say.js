import { SayPlatformDarwin } from './platform/darwin.js'
import { SayPlatformLinux } from './platform/linux.js'
import { SayPlatformWin32 } from './platform/win32.js'

const MACOS = 'darwin'
const LINUX = 'linux'
const WIN32 = 'win32'

export class Say {
  constructor (platform, debug) {
    if (!platform) {
      platform = process.platform
    }

    if (platform === MACOS) {
      return new SayPlatformDarwin(debug)
    } else if (platform === LINUX) {
      return new SayPlatformLinux(debug)
    } else if (platform === WIN32) {
      return new SayPlatformWin32(debug)
    }

    throw new Error(`new Say(): unsupported platorm! ${platform}`)
  }
}

export const say = new Say()
export const platforms = {
  WIN32: WIN32,
  MACOS: MACOS,
  LINUX: LINUX
}
