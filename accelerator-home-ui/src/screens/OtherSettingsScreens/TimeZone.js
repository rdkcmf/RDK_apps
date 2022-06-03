import { Lightning, Language, Router } from "@lightningjs/sdk";
import AppApi from "../../api/AppApi";
import { CONFIG } from "../../Config/Config";
import TimeZoneItem from "../../items/TimeZoneItem";

export default class TimeZone extends Lightning.Component {

    _onChanged() {
        this.widgets.menu.updateTopPanelText(Language.translate('Settings  Other Settings  Advanced Settings  Device  Time'));
    }

    pageTransition() {
        return 'left'
    }


    static _template() {
        return {
            rect: true,
            h: 1080,
            w: 1920,
            color: CONFIG.theme.background,
            TimeZone: {
                x: 200,
                y: 275,
                List: {
                    type: Lightning.components.ListComponent,
                    w: 1920 - 300,
                    itemSize: 90,
                    horizontal: false,
                    invertDirection: true,
                    roll: true,
                    itemScrollOffset: -4,
                },
                Error: {
                    alpha: 0,
                    x: 560,
                    y: 340,
                    mountX: 0.5,
                    MSG: {
                        text: {
                            text: 'TimeZone API not present',
                            fontFace: CONFIG.language.font,
                            fontSize: 40,
                            textColor: 0xffffffff
                        },
                    },
                }
            },
        }
    }

    async _firstEnable() {
        this.appApi = new AppApi()
        this.resp = await this.appApi.fetchTimeZone()
    }

    async _focus() {
        let data = []
        this.zone = await this.appApi.getZone()
        try {
            console.log(this.resp)
            delete this.resp.Etc
            for (const i in this.resp) {
                if (typeof this.resp[i] === 'object') {
                    data.push([i, this.resp[i], this.zone.split('/')[0] === i])
                }
            }
        } catch (error) {
            console.log('no api present')
        }

        console.log(data)
        if (data.length > 1) {
            this.tag('List').h = data.length * 90
            this.tag('List').items = data.map((item, idx) => {
                return {
                    ref: 'Time' + idx,
                    w: 1620,
                    h: 90,
                    type: TimeZoneItem,
                    item: item,
                    zone: this.zone.split('/')[1]
                }
            })
        } else {
            this.tag('Error').alpha = 1
        }

    }

    _getFocused() {
        return this.tag('List').element
    }


    _handleDown() {
        this.tag('List').setNext()
    }

    _handleUp() {
        this.tag('List').setPrevious()
    }

    _handleBack() {
        Router.navigate('settings/advanced/device')
    }

    static _states() {
        return [];
    }
}