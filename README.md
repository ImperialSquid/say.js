## Say.js
Forked and modified from [Marak/say.js](https://https://github.com/Marak/say.js) to use more upto date dependencies. This is mostly for use in my TTS zotero plugin [ZoTTS](https://github.com/ImperialSquid/zotero-zotts). The old README is [here](README-OLD.md).

## Changes
- [x] Update dependencies
- [x] Update tests
  - [x] Moved to GH Actions, removed Travis CI
  - [x] Added tests for Linux
  - [x] Added tests for Windows
- [x] Update README
- [x] Add debug output to speak
- [x] Update MacOS to return voices

## TODO and Issues
- [ ] Fix tests
  - Linux tests are failing, reports as success but runner has no sound card, a solution probably exists but needs research
- [ ] Add getVoices for linux
  - Prompt for getting voices in festival seems to be [interactive](https://wiki.archlinux.org/title/Festival#Interactive), not sure how much work this is, needs investigation