import { TestPage } from './../pages/test/test';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public screenOrientation: ScreenOrientation,
   ) {
    platform.ready().then(() => {
      statusBar.show();
      splashScreen.hide();
      statusBar.overlaysWebView(false);
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#0097A7');
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    });
    
  }
}

