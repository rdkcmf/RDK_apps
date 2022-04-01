import { Lightning, Utils } from "@lightningjs/sdk";
import { CONFIG } from "../Config/Config";
import { ProgressBar } from '@lightningjs/ui-components'

export default class AppStoreItem extends Lightning.Component {
    static _template() {
        return {
            Shadow: {
                y: -10,
                alpha: 0,
                rect: true,
                color: CONFIG.theme.hex,
                h: this.height + 20,
                w: this.width,
            },
            Image: {
                h: this.height,
                w: this.width
            },
            Overlay: {
                alpha: 0,
                rect: true,
                color: 0xAA000000,
                h: this.height,
                w: this.width,
                OverlayText: {
                    alpha: 0,
                    mount: 0.5,
                    x: this.width / 2,
                    y: this.height / 2,
                    text: {
                        text: 'Installing',
                        fontFace: CONFIG.language.font,
                        fontSize: 20,
                    },
                    ProgressBar: {
                        y: 30,
                        x: -50,
                        type: ProgressBar,
                        w: 200,
                        progress: 1,
                        barColor: 4284637804,
                        progressColor: 4127195135,
                        animationDuration: 5
                    }
                },
            },
            Text: {
                alpha: 0,
                y: this.height + 10,
                text: {
                    text: '',
                    fontFace: CONFIG.language.font,
                    fontSize: 25,
                },
            },
        }
    }

    set info(data) {
        this.data = data
        if (data.url.startsWith('/images')) {
            this.tag('Image').patch({
                src: Utils.asset(data.url),
            });
        } else {
            this.tag('Image').patch({
                src: data.url,
            });
        }
        this.tag('Text').text.text = data.displayName
        // this.tag('Shadow').y = this.tag('Shadow').y - 10
    }

    static get width() {
        return 300
    }

    static get height() {
        return 168
    }

    _focus() {
        this.scale = 1.15
        this.zIndex = 2
        this.tag("Shadow").alpha = 1
        this.tag("Text").alpha = 1
    }
    _unfocus() {
        this.scale = 1
        this.zIndex = 1
        this.tag("Shadow").alpha = 0
        this.tag("Text").alpha = 0
    }
}