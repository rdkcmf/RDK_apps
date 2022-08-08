import { Lightning, Router, Storage, Language, Registry } from "@lightningjs/sdk";
import { Grid, List } from "@lightningjs/ui";
import AppApi from "../api/AppApi";
import HomeApi from "../api/HomeApi";
import { CONFIG } from "../Config/Config";
import AppStoreItem from "../items/AppStoreItem";
import OptionsItem from "../items/OptionsItems";

const homeApi = new HomeApi()

export default class AppStore extends Lightning.Component {

    _onChanged() {
        this.widgets.menu.updateTopPanelText(Language.translate('Apps'))
    }

    static _template() {
        return {
            rect: true,
            h: 1080,
            w: 1920,
            color: CONFIG.theme.background,
            Container: {
                x: 200,
                y: 270,
                Options: {
                    // x: 10,
                    type: List,
                    direction: 'row',
                    spacing: 30,
                },
                Apps: {
                    x: 20,
                    y: 120,
                    type: Grid,
                    columns: 5,
                    itemType: AppStoreItem,
                    w: 1920,
                    h: (AppStore.height + 90) * 2 + 2 * 20 - 10,
                    scroll: {
                        after: 2
                    },
                    spacing: 20
                }
            },

        }
    }

    _firstEnable() {
        let apps = homeApi.getAllApps()
        apps.shift()
        const options = ['My Apps', 'App Catalog', 'ManageApps']
        this.tag('Apps').add(apps.map((element) => {
            return { h: AppStoreItem.height + 90, w: AppStoreItem.width, info: element }
        }));
        this.tag('Options').add(options.map((element, idx) => {
            return {
                type: OptionsItem,
                element: element,
                w: OptionsItem.width,
                idx
            }
        }))
        this.options = {
            0: () => {
                this.tag('Apps').add(apps.map((element) => {
                    return { h: AppStoreItem.height + 90, w: AppStoreItem.width, info: element }
                }));
            },
            1: () => {
                this.tag('Apps').clear()
            },
            2: () => {
                this.tag('Apps').clear()
            },
        }
    }

    $selectOption(option, obj) {
        this.tag('Apps').clear()
        obj._focus()
        this.options[option]()
        if (this.tag('Apps').length) {
            this._setState('Apps')
        }
    }

    _handleLeft() {
        Router.focusWidget('Menu')
    }

    pageTransition() {
        return 'up'
    }

    _handleUp() {
        this.widgets.menu.notify('TopPanel')
    }

    _focus() {
        this._setState('Options')
    }

    static _states() {
        return [
            class Options extends this{
                _getFocused() {
                    return this.tag('Options')
                }
                _handleDown() {
                    this._setState('Apps')
                }
            },
            class Apps extends this{
                _getFocused() {
                    return this.tag('Apps')
                }
                _handleUp() {
                    this._setState('Options')
                }
                _handleEnter() {
                    let appApi = new AppApi();
                    let applicationType = this.tag('Apps').currentItem.data.applicationType;
                    this.uri = this.tag('Apps').currentItem.data.uri;
                    applicationType = this.tag('Apps').currentItem.data.applicationType;
                    Storage.set('applicationType', applicationType);
                    console.log(this.uri, applicationType)
                    if (Storage.get('applicationType') == 'Cobalt') {
                        appApi.getPluginStatus('Cobalt')
                            .then(() => {
                                appApi.launchCobalt(this.uri).catch(err => { });
                                appApi.setVisibility('ResidentApp', false);
                            })
                            .catch(err => {
                                console.log('Cobalt plugin error', err)
                                Storage.set('applicationType', '')
                            })
                    } else if (Storage.get('applicationType') == 'WebApp' && Storage.get('ipAddress')) {
                        appApi.launchWeb(this.uri)
                            .then(() => {
                                appApi.setVisibility('ResidentApp', false);
                                let path = location.pathname.split('index.html')[0]
                                let url = path.slice(-1) === '/' ? "static/overlayText/index.html" : "/static/overlayText/index.html"
                                let notification_url = location.origin + path + url
                                appApi.launchOverlay(notification_url, 'TextOverlay').catch(() => { })
                                Registry.setTimeout(() => {
                                    appApi.deactivateResidentApp('TextOverlay')
                                    appApi.zorder('HtmlApp')
                                    appApi.setVisibility('HtmlApp', true)
                                }, 9000)
                            }).catch(() => { })
                    } else if (Storage.get('applicationType') == 'Lightning' && Storage.get('ipAddress')) {
                        appApi.launchLightning(this.uri).catch(() => { });
                        appApi.setVisibility('ResidentApp', false);
                    } else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
                        appApi.launchNative(this.uri).catch(() => { });
                        appApi.setVisibility('ResidentApp', false);
                    } else if (Storage.get('applicationType') == 'Amazon') {
                        console.log('Launching app')
                        appApi.getPluginStatus('Amazon')
                            .then(result => {
                                appApi.launchPremiumApp('Amazon').catch(() => { });
                                appApi.setVisibility('ResidentApp', false);
                            })
                            .catch(err => {
                                console.log('Amazon plugin error', err)
                                Storage.set('applicationType', '')
                            })

                    } else if (Storage.get('applicationType') == 'Netflix') {
                        console.log('Launching app')
                        this.fireAncestors("$initLaunchPad").then(() => { }).catch(() => { })
                    }
                }
            }
        ];
    }
}