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
/**Color constants */

const themeOptions = {
  partnerOne: {
    hex: 0xfff58233,
    logo: 'RDKLogo.png',
    background: '0xff000000'
  },
  partnerTwo: {
    hex: 0xff91c848,
    logo: 'RDKLogo.png',
    background: '0xff000000'
  },
}

const language = {
  English: {
    id: 'en',
    fontSrc: 'Play/Play-Regular.ttf',
    font: 'Play'
  },
  Spanish: {
    id: 'sp',
    fontSrc: 'Play/Play-Regular.ttf',
    font: 'Play'
  },

}

export const availableLanguages = ['English', 'Spanish'];

export var CONFIG = {
  theme: themeOptions['partnerOne'],
  language: (localStorage.getItem('Language') != null && availableLanguages.includes(localStorage.getItem('Language'))) ? language[localStorage.getItem('Language')] : language['English']
}
