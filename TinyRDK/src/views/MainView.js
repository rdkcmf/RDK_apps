import { Lightning, Storage, Router ,Log, Settings} from "@lightningjs/sdk";
import { CONFIG } from '../Config/Config.js'
import { List } from '@lightningjs/ui'
import HomeApi from "../api/HomeApi.js";
import ListItem from '../items/ListItem.js'
import AppApi from "../api/AppApi.js";
import { ProgressBar } from '@lightningjs/ui-components'

export default class MainView extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: CONFIG.theme.background,
      w: 1920,
      h: 1080,
      clipping: true,
      MainView: {
        w: 1720,
        h: 1200,
        zIndex: 2,
        y: 270,
        x: 200,
        clipping: false,


        Text1: {
          h: 30,
          text: {
            //   fontFace: CONFIG.language.font,
            fontSize: 25,
            text: 'Featured Content',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
          zIndex: 0
        },
        AppList: {
          y: 37,
          x: 0,
          type: List,
          h: 400,
          scroll: {
            after: 2
          },
          spacing: 20,
        },

        Text2: {
          // x: 10 + 25,
          y: 395,
          h: 30,
          text: {
            //   fontFace: CONFIG.language.font,
            fontSize: 25,
            text: 'Lightning Apps',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        MetroApps: {
          x: -20,
          y: 435,
          type: List,
          // flex: { direction: 'row', paddingLeft: 20, wrap: false },
          // w: 1745,
          h: 300,
          scroll: {
            after: 6
          },
          spacing: 20
          // itemSize: 288,
          // roll: true,
          // rollMax: 1745,
          // horizontal: true,
          // itemScrollOffset: -4,
          // clipping: false,
        },
        Text3: {
          // x: 10 + 25,
          y: 695,
          h: 30,
          text: {
            //   fontFace: CONFIG.language.font,
            fontSize: 25,
            text: 'Featured Video on Demand',
            fontStyle: 'normal',
            textColor: 0xFFFFFFFF,
          },
        },
        TVShows: {
          x: -20,
          y: 735,
          type: List,
          h: 300,
          scroll: {
            after: 12
          },
          spacing: 20
        }
      }
    }

  }

_firstActive(){
  this.flag = true

    let self = this;
    var appItems ;
     var metroApps;
     var tvShowItems;
    // setTimeout(function () {
      self.appApi = new AppApi();
      self.homeApi = new HomeApi();
      // the above snippet takes about 1-1.5 milliseconds
      appItems  = self.homeApi.getAppListInfo()
      self.metroApps = self.homeApi.getOfflineMetroApps()
      // this snippet takes about 200-220 milliseconds

      self.tvShowItems = self.homeApi.getTVShowsInfo();
      appItems.shift();
      self.appItems = appItems
      self._setState("AppList.0")
    // the above snippet takes about 1-1.5 milliseconds
    
    // this snippet takes about 200-220 milliseconds
    
    // this snippet takes about 20 milli seconds
    // self.tvShowItems = self.homeApi.getTVShowsInfo();
    // });

    
    // the below timeout should run as the last timeout in this first active function
    setTimeout(function(){
      self.fireAncestors("$setEventListeners")
    },0)

   
}
  set appItems(items) {
    this.currentItems = items
    let appList = this.tag('AppList');
    // appList.clear();
    let index = 0;
    let lastIndex = items.length
    function addItem() {
      if (index < lastIndex) {
        appList.add({
          w: 454,
          h: 255,
          type: ListItem,
          data: items[index],
          focus: 1.11,
          unfocus: 1,
          idx: index,
          bar: 12
        });
        index++
        requestAnimationFrame(addItem)
      }
      else {
        return;
      }
    }
    requestAnimationFrame(addItem)
  }

  set metroApps(items) {
    let metroApps = this.tag('MetroApps');
    let lastIndex = items.length
    let index = 0;
    function addItem() {
      if (index < lastIndex) {
        metroApps.add({
          w: 268,
          h: 151,
          type: ListItem,
          data: items[index],
          focus: 1.15,
          unfocus: 1,
          idx: index,
          bar: 12
        });
        index++;

        requestAnimationFrame(addItem);
      }
      else {
        return;
      }
    }
    requestAnimationFrame(addItem)
  }

  set tvShowItems(items) {
    let tvShowList = this.tag('TVShows');
    let index = 0;
    let lastIndex = items.length
    function addItem() {
      if (index < lastIndex) {
        tvShowList.add({
          w: 268,
          h: 151,
          type: ListItem,
          data: items[index],
          focus: 1.11,
          unfocus: 1,
          idx: index,
          bar: 12
        });
        index++
        requestAnimationFrame(addItem)
      }
      else {
        return;
      }
    }
    requestAnimationFrame(addItem)
  }
  scroll(val) {
    this.tag("MainView").y = val
  }

  


  static _states() {
    return [

      class AppList extends this {
        $enter() {
          this.indexVal = 0
        }
        $exit() {
          this.tag('Text1').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text1').text.fontStyle = 'bold'
          if (this.tag('AppList').length) {
            return this.tag('AppList')
          }
        }
        _handleDown() {
          this._setState('MetroApps')
        }
        _handleUp() {
            this.widgets.menu.notify('TopPanel')
        }
        _handleLeft() {
          this.tag('Text1').text.fontStyle = 'normal'
          Router.focusWidget('Menu')
        }
        _handleEnter() {
          let applicationType = this.tag('AppList').items[this.tag('AppList').index].data.applicationType;
          this.uri = this.tag('AppList').items[this.tag('AppList').index].data.uri;
          Storage.set('applicationType', applicationType);
          this.appApi.launchApp(applicationType, this.uri);
        }
      },

      class MetroApps extends this {
        $enter() {
          this.indexVal = 1
        }
        $exit() {
          this.tag('Text2').text.fontStyle = 'normal'
        }
        _getFocused() {
          this.tag('Text2').text.fontStyle = 'bold'
          if (this.tag('MetroApps').length) {
            return this.tag('MetroApps')
          }
        }
        _handleUp() {
          this._setState('AppList')
        }
        _handleDown() {
          this._setState('TVShows')
        }
        _handleRight() {
          if (this.tag('MetroApps').length - 1 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setNext()
            return this.tag('MetroApps').element
          }
        }
        _handleLeft() {
          this.tag('Text2').text.fontStyle = 'normal'
          if (0 != this.tag('MetroApps').index) {
            this.tag('MetroApps').setPrevious()
            return this.tag('MetroApps').element
          }
          // } else {
          //   Router.focusWidget('Menu')
          // }
        }
        _handleEnter() {
          let applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;

          applicationType = this.tag('MetroApps').items[this.tag('MetroApps').index].data.applicationType;
          Storage.set('applicationType', applicationType);
          this.uri = this.tag('MetroApps').items[this.tag('MetroApps').index].data.uri;
          this.appApi.launchApp(applicationType, this.uri);
           /* else if (Storage.get('applicationType') == 'Native' && Storage.get('ipAddress')) {
                    this.appApi.launchNative(this.uri);
                    this.appApi.setVisibility('ResidentApp', false);
                  } */
        }
      },
      class TVShows extends this {
        $enter() {
          this.indexVal = 2
          this.scroll(-70)
        }
        _handleUp() {
          this.scroll(270)
          this._setState('MetroApps')
        }
        _getFocused() {
          this.tag('Text3').text.fontStyle = 'bold'
          return this.tag('TVShows')
        }
        _handleRight() {
          if (this.tag('TVShows').length - 1 != this.tag('TVShows').index) {
            this.tag('TVShows').setNext()
            return this.tag('TVShows').element
          }
        }
        _handleLeft() {
          this.tag('Text3').text.fontStyle = 'normal'
          if (0 != this.tag('TVShows').index) {
            this.tag('TVShows').setPrevious()
            return this.tag('TVShows').element
          }
          //  else {a
          //   Router.focusWidget('Menu')
          // }
        }
        _handleEnter() {
          if (Storage.get('ipAddress')) {
            //this.fireAncestors('$goToPlayer')
            Router.navigate('player')
          }
       
        }
        $exit() {
          this.tag('Text3').text.fontStyle = 'normal'
        }
      },
    ]
  }

}