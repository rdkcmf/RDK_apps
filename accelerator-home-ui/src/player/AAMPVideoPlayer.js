/**
 * If not stated otherwise in this file or this component's LICENSE
 * file the following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import { Lightning } from '@lightningjs/sdk'
import PlayerControls from './PlayerControl.js'

/**
 * Class to render AAMP video player.
 */
export default class AAMPVideoPlayer extends Lightning.Component {
  /**
   * Function to render player controls.
   */
  static _template() {
    return {
      PlayerControls: {
        type: PlayerControls,
        x: 0,
        y: 810,
        alpha: 0,
        signals: {
          pause: 'pause',
          play: 'play',
          hide: 'hidePlayerControls',
          fastfwd: 'fastfwd',
          fastrwd: 'fastrwd',
        },
      },
    }
  }

  _init() {
    this.x = 0
    this.y = 0
    this.w = 0
    this.h = 0
    this.videoEl = document.createElement('video')
    this.videoEl.setAttribute('id', 'video-player')
    this.videoEl.style.position = 'absolute'
    this.videoEl.style.zIndex = '1'
    this.videoEl.setAttribute('width', '100%')
    this.videoEl.setAttribute('height', '100%')
    this.videoEl.setAttribute('src', 'placeholder.mp4')
    this.videoEl.setAttribute('type', 'video/ave')
    document.body.appendChild(this.videoEl)
    this.playbackSpeeds = [-16, -8, -4, -2, 1, 2, 4, 8, 16]
    this.playerStatesEnum = { idle: 0, initializing: 1, playing: 8, paused: 6, seeking: 7 }
    this.player = null
    this.playbackRateIndex = this.playbackSpeeds.indexOf(1)
    this.defaultInitConfig = {
      initialBitrate: 2500000,
      offset: 0,
      networkTimeout: 10,
      preferredAudioLanguage: 'en',
      liveOffset: 15,
      drmConfig: null,
    }
  }

  /**
   * Function to set video coordinates.
   * @param {int} x x position of video
   * @param {int} y y position of video
   * @param {int} w width of video
   * @param {int} h height of video
   */
  setVideoRect(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    var xPos = 0.67 * x
    var yPos = 0.67 * y
    var wPos = 0.67 * w
    var hPos = 0.67 * h
    this.player.setVideoRect(xPos, yPos, wPos, hPos)
  }

  /**
   * Event handler to store the current playback state.
   * @param  event playback state of the video.
   */
  _playbackStateChanged(event) {
    switch (event.state) {
      case this.player.playerStatesEnum.idle:
        this.playerState = this.player.playerStatesEnum.idle
        break
      case this.player.playerStatesEnum.initializing:
        this.playerState = this.player.playerStatesEnum.initializing
        break
      case this.player.playerStatesEnum.playing:
        this.playerState = this.player.playerStatesEnum.playing
        break
      case this.player.playerStatesEnum.paused:
        this.playerState = this.player.playerStatesEnum.paused
        break
      case this.player.playerStatesEnum.seeking:
        this.playerState = this.player.playerStatesEnum.seeking
        break
      default:
        break
    }
  }

  /**
   * Event handler to handle the event of completion of a video playback.
   */
  _mediaEndReached() {
    this.load(this.videoInfo)
    this.setVideoRect(this.x, this.y, this.w, this.h)
  }

  /**
   * Event handler to handle the event of changing the playback speed.
   */
  _mediaSpeedChanged() {}

  /**
   * Event handler to handle the event of bit rate change.
   */
  _bitrateChanged() {}

  /**
   * Function to handle the event of playback failure.
   */
  _mediaPlaybackFailed() {
    this.load(this.videoInfo)
  }

  /**
   * Function to handle the event of playback progress.
   * @param event playback event.
   */
  _mediaProgressUpdate(event) {
    this.position = event.positionMiliseconds / 1000
    this.tag('PlayerControls').currentTime = this.position
  }

  /**
   * Function to handle the event of starting the playback.
   */
  _mediaPlaybackStarted() {
    // this.tag('PlayerControls').reset()
    // this.tag('PlayerControls').setSmooth('alpha', 1)
    // this.tag('PlayerControls').setSmooth('y', 675, { duration: 1 })
    // this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000)
  }

  /**
   * Function to handle the event of change in the duration of the playback content.
   */
  _mediaDurationChanged() {}

  /**
   * Function to create the video player instance for video playback and its initial settings.
   */
  createPlayer() {
    if (this.player !== null) {
      this.destroy()
      this.player = null
    }

    try {
      this.player = new AAMPMediaPlayer()
      this.player.addEventListener('playbackStateChanged', this._playbackStateChanged)
      this.player.addEventListener('playbackCompleted', this._mediaEndReached.bind(this))
      this.player.addEventListener('playbackSpeedChanged', this._mediaSpeedChanged)
      this.player.addEventListener('bitrateChanged', this._bitrateChanged)
      this.player.addEventListener('playbackFailed', this._mediaPlaybackFailed.bind(this))
      this.player.addEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this))
      this.player.addEventListener('playbackStarted', this._mediaPlaybackStarted.bind(this))
      this.player.addEventListener('durationChanged', this._mediaDurationChanged)
      this.playerState = this.playerStatesEnum.idle
    } catch (error) {
      console.error('AAMPMediaPlayer is not defined')
    }
  }

  /**
   * Loads the player with video URL.
   * @param videoInfo the url and the info regarding the video like title.
   */
  load(videoInfo) {
    this.createPlayer()
    this.videoInfo = videoInfo
    this.configObj = this.defaultInitConfig
    this.configObj.drmConfig = this.videoInfo.drmConfig
    this.player.initConfig(this.configObj)
    this.player.load(videoInfo.url)

    this.tag('PlayerControls').title = videoInfo.title
    this.tag('PlayerControls').subtitle = videoInfo.subtitle
    this.tag('PlayerControls').logoPath = videoInfo.logoPath
    this.tag('PlayerControls').duration = this.player.getDurationSec()
    this.tag('PlayerControls').currentTime = 0
    this.play()
  }

  /**
   * Starts playback when enough data is buffered at play head.
   */
  play() {
    this.player.play()
    this.playbackRateIndex = this.playbackSpeeds.indexOf(1)
  }

  /**
   * Pauses playback.
   */
  pause() {
    this.player.pause()
  }

  /**
   * Stop playback and free resources.
   */
  stop() {
    this.player.stop()
    this.hidePlayerControls()
  }

  /**
   * Function to perform fast forward of the video content.
   */
  fastfwd() {
    if (this.playbackRateIndex < this.playbackSpeeds.length - 1) {
      this.playbackRateIndex++
    }
    this.rate = this.playbackSpeeds[this.playbackRateIndex]
    this.player.setPlaybackRate(this.rate)
  }

  /**
   * Function to perform fast rewind of the video content.
   */
  fastrwd() {
    if (this.playbackRateIndex > 0) {
      this.playbackRateIndex--
    }
    this.rate = this.playbackSpeeds[this.playbackRateIndex]
    this.player.setPlaybackRate(this.rate)
  }

  /**
   * Function that returns player instance.
   * @returns player instance.
   */
  getPlayer() {
    return this.player
  }

  /**
   * Function to release the video player instance when not in use.
   */
  destroy() {
    if (this.player.getCurrentState() !== this.playerStatesEnum.idle) {
      this.player.stop()
    }
    this.player.removeEventListener('playbackStateChanged', this._playbackStateChanged)
    this.player.removeEventListener('playbackCompleted', this._mediaEndReached)
    this.player.removeEventListener('playbackSpeedChanged', this._mediaSpeedChanged)
    this.player.removeEventListener('bitrateChanged', this._bitrateChanged)
    this.player.removeEventListener('playbackFailed', this._mediaPlaybackFailed.bind(this))
    this.player.removeEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this))
    this.player.removeEventListener('playbackStarted', this._mediaPlaybackStarted.bind(this))
    this.player.removeEventListener('durationChanged', this._mediaDurationChanged)
    this.player.release()
    this.player = null
    this.hidePlayerControls()
  }

  /**
   * Function to hide the player controls.
   */
  hidePlayerControls() {
    this.tag('PlayerControls').setSmooth('y', 1080, { duration: 0.7 })
    this.tag('PlayerControls').setSmooth('alpha', 0, { duration: 0.7 })
    this._setState('HideControls')
  }

  /**
   * Function to show the player controls.
   */
  showPlayerControls() {
    this.tag('PlayerControls').reset()
    this.tag('PlayerControls').setSmooth('alpha', 1)
    this.tag('PlayerControls').setSmooth('y', 675, { duration: 0.7 })
    this._setState('ShowControls')
    this.timeout = setTimeout(this.hidePlayerControls.bind(this), 5000)
  }
  /**
   * Function to display player controls on down key press.
   */
  _handleDown() {
    this.tag('PlayerControls').setSmooth('alpha', 1, { duration: 1 })
    this.tag('PlayerControls').setSmooth('y', 675, { duration: 1 })
    this._setState('ShowControls')
    clearTimeout(this.timeout)
  }

  /**
   *Function to hide player control on up key press.
   */
  _handleUp() {
    this.hidePlayerControls()
    this._setState('HideControls')
  }
  /**
   * Function to define the different states of the video player.
   */
  static _states() {
    return [
      class ShowControls extends this {
        _getFocused() {
          return this.tag('PlayerControls')
        }
      },
      class HideControls extends this {
        _getFocused() {}
      },
    ]
  }
}
