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
import OtherSettingsScreen from '../screens/OtherSettingsScreens/OtherSettingsScreen'
import SleepTimerScreen from '../screens/SleepTimerScreen'
import EnergySaverScreen from '../screens/OtherSettingsScreens/EnergySavingsScreen'
import LanguageScreen from '../screens/OtherSettingsScreens/LanguageScreen'
import PrivacyScreen from '../screens/OtherSettingsScreens/PrivacyScreen'
import PrivacyPolicyScreen from '../screens/OtherSettingsScreens/PrivacyPolicyScreen'
import AdvancedSettingsScreen from '../screens/OtherSettingsScreens/AdvancedSettingsScreen'
import DeviceScreen from '../screens/OtherSettingsScreens/DeviceScreen'
import DeviceInformationScreen from '../screens/OtherSettingsScreens/DeviceInformationScreen'
import FirmwareScreen from '../screens/OtherSettingsScreens/FirmwareScreen'
import RebootConfirmationScreen from '../screens/OtherSettingsScreens/RebootConfirmationScreen'
import TimeZone from '../screens/OtherSettingsScreens/TimeZone'
import TimeItems from '../items/TimeItems'


export default {
  otherSettingsRoutes: [
    {
      path: 'settings/other',
      component: OtherSettingsScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/other/timer',
      component: SleepTimerScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/other/energy',
      component: EnergySaverScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/other/language',
      component: LanguageScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/other/privacy',
      component: PrivacyScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/other/privacyPolicy',
      component: PrivacyPolicyScreen,
      widgets: ['Menu', 'Volume'],
    },

    {
      path: 'settings/advanced',
      component: AdvancedSettingsScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device',
      component: DeviceScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device/info',
      component: DeviceInformationScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device/timezone',
      component: TimeZone,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device/timezone/item',
      component: TimeItems,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device/firmware',
      component: FirmwareScreen,
      widgets: ['Menu', 'Volume'],
    },
    {
      path: 'settings/advanced/device/reboot',
      component: RebootConfirmationScreen,
    },
  ]
}