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

import { Storage ,Log} from "@lightningjs/sdk";
import ThunderJS from "ThunderJS";
import AppApi from "../api/AppApi";
import Keymap from "../Config/Keymap";

const config = {
    host: '127.0.0.1',
    port: 9998,
    default: 1,
};
const thunder = ThunderJS(config);
const appApi = new AppApi()

export function keyIntercept() {
    const rdkshellCallsign = 'org.rdk.RDKShell';
    thunder.Controller.activate({ callsign: rdkshellCallsign })
        .then(result => {
            Log.info('Successfully activated RDK Shell');
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' });
        })
        .catch(err => {
            Log.info('Error', err);
        })

        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.AudioVolumeMute,
                    modifiers: [],
                })
                .then(result => {
                    Log.info('addKeyIntercept success');
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })



        .then(result => {
            thunder.on(rdkshellCallsign, 'onSuspended', notification => {
                if (notification) {
                    Log.info('onSuspended notification: ' + notification.client);
                    if (Storage.get('applicationType') == notification.client) {
                        Storage.set('applicationType', '');
                        appApi.setVisibilityandFocus('ResidentApp', true);
                        thunder.call('org.rdk.RDKShell', 'moveToFront', { client: 'ResidentApp' }).then(result => {
                            Log.info('ResidentApp moveToFront Success');
                        });
                        thunder.call('org.rdk.RDKShell', 'setFocus', { client: 'ResidentApp' }).then(result => {
                            Log.info('ResidentApp setFocus Success');
                        });
                    }
                }
            });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Escape,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.F1,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Inputs_Shortcut,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Picture_Setting_Shortcut,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Power,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.F7,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.AudioVolumeUp,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.AudioVolumeDown,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'foreground',
                    keyCode: Keymap.AudioVolumeDown,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'foreground',
                    keyCode: Keymap.AudioVolumeUp,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'foreground',
                    keyCode: Keymap.AudioVolumeMute,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.MediaFastForward,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: 142,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Home,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.MediaRewind,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'ResidentApp',
                    keyCode: Keymap.Pause,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Cobalt',
                    keyCode: Keymap.Escape,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Amazon',
                    keyCode: Keymap.Escape,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Cobalt',
                    keyCode: Keymap.Home,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Amazon',
                    keyCode: Keymap.Home,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Cobalt',
                    keyCode: Keymap.Backspace,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
        .then(result => {
            thunder
                .call(rdkshellCallsign, 'addKeyIntercept', {
                    client: 'Amazon',
                    keyCode: Keymap.Backspace,
                    modifiers: [],
                })
                .catch(err => {
                    Log.info('Error', err);
                });
        })
        .catch(err => {
            Log.info('Error', err);
        })
}