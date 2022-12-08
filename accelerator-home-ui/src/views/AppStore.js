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
        const options = ['My Apps', 'App Catalog', 'Manage Apps']
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
    _handleBack() {
        Router.focusWidget('Menu');
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
                    let params = {
                        url: this.tag('Apps').currentItem.data.uri,
                        launchLocation: "appsMenu"
                    }
                    console.log(params, applicationType)
                    appApi.launchApp(applicationType, params).catch(err => {
                        console.log(applicationType + ' plugin error: ' + JSON.stringify(err))
                    })
                }
            }
        ];
    }
}