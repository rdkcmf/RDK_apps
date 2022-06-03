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

import { Lightning, Utils, Language, Router } from "@lightningjs/sdk";
import { CONFIG } from "../../../Config/Config";
import { COLORS } from "../../../colors/Colors";
import { Keyboard } from "../../../ui-components";
import { KEYBOARD_FORMATS } from "../../../ui-components/components/Keyboard";

export default class IntegerInput extends Lightning.Component {
  static _template() {
    return {
      x: 200,
      y: 275,
      InputBox: {
        Border: {
          texture: Lightning.Tools.getRoundRect(
            1600,
            90,
            0,
            3,
            0xffffffff,
            false
          ),
        },
        Content: {
          x: 50,
          y: 50,
          mountY: 0.5,
          text: {
            text: "Enter the value and click Done",
            textColor: COLORS.titleColor,
            fontFace: CONFIG.language.font,
            fontSize: 25,
          },
        },
      },
      Keyboard: {
        x: 660,
        y: 200,
        type: Keyboard,
        visible: true,
        zIndex: 2,
        formats: KEYBOARD_FORMATS.numbers,
      },
    };
  }

  _focus() {
    this._setState("InputBox");
    this.tag("Content").text.text =
      this.prevVal === "" ? "Enter the value and click Done" : this.prevVal;
    this.inputValue = this.prevVal;
  }

  handleDone() {
    // console.log(this.inputValue);
    this.onHandleDone(this.inputValue);
    this._handleBack();
  }

  static _states() {
    return [
      class InputBox extends this {
        $enter() {
          this.tag("InputBox.Border").texture = Lightning.Tools.getRoundRect(
            1600,
            90,
            0,
            5,
            CONFIG.theme.hex,
            false
          );
        }
        $exit() {
          this.tag("InputBox.Border").texture = Lightning.Tools.getRoundRect(
            1600,
            90,
            0,
            3,
            0xffffffff,
            false
          );
        }

        _handleDown() {
          this._setState("Keyboard");
        }
        _handleEnter() {
          this._setState("Keyboard");
        }
        _handleUp() {
          // do nothing
        }
      },
      class Keyboard extends this {
        _handleDown() {
          // do nothing
        }
        _handleUp() {
          this._setState("InputBox");
        }
        _getFocused() {
          return this.tag("Keyboard");
        }
        _handleBack() {
          this._setState("InputBox");
        }

        $onSoftKey({ key }) {
          if (key === "Done") {
            this.handleDone();
          } else if (key === "Clear") {
            this.inputValue = this.inputValue.substring(
              0,
              this.inputValue.length - 1
            );
          } else if (key === "Delete") {
            this.inputValue = "";
          } else {
            this.inputValue += key;
          }

          this.tag("Content").text.text = this.inputValue;
        }
      },
    ];
  }
}
