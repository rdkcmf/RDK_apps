import { Lightning } from "@lightningjs/sdk";
import { CONFIG } from "../Config/Config";

export default class OptionsItem extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
                Text: {
                    text: {
                        text: '',
                        fontFace: CONFIG.language.font,
                        fontSize: 35
                    },
                },
                Bar: {
                    y: 50,
                    texture: Lightning.Tools.getRoundRect(0, 5, 0, 0, CONFIG.theme.hex, true, CONFIG.theme.hex),
                }
            },
        }
    }

    _focus() {
        this.tag('Bar').texture = Lightning.Tools.getRoundRect(this.tag('Text').finalW, 5, 0, 0, CONFIG.theme.hex, true, CONFIG.theme.hex)
        this.tag('Text').text.fontStyle = 'bold'
    }

    _unfocus() {
        this.tag('Bar').texture = Lightning.Tools.getRoundRect(0, 5, 0, 0, CONFIG.theme.hex, true, CONFIG.theme.hex)
        this.tag('Text').text.fontStyle = ''
    }

    static get width() {
        return 200
    }

    _handleEnter() {
        this.fireAncestors('$selectOption', this.idx, this)
        this._focus()
    }

    _handleDown(){
        this._handleEnter()
    }

    set element(item) {
        this.tag('Text').text.text = item
    }
}