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
import Home from './../screens/HomeScreen'
import SplashScreen from './../screens/SplashScreen'
import Settings from './../screens/SettingsScreen'
import Error from './../screens/Error'

export default {
  root: 'home',
  routes: [
    {
      path: 'home',
      component: Home,
      before() {
        console.log('before home!')
        return Promise.resolve()
      },
      cache: 10,
    },
    {
      path: 'settings/:screen',
      options: {
        preventStorage: true,
        clearHistory: true,
        reuseInstance: true
      },
      component: Settings,
      cache: 10,
    },
    {
      path: 'splash',
      component: SplashScreen,
      options: {
        preventStorage: true,
        clearHistory: true,
        reuseInstance: false
      },
      cache: 10,
    },
    {
      path: '!',
      component: Error,
    },
    {
      path: '*',
      component: Home,
    },
  ],
}
