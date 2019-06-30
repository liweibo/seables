import { ModalPage } from './../pages/modal/modal';
import { TestPage } from './../pages/test/test';
import { DetailsPage } from './../pages/details/details';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BLE } from '@ionic-native/ble';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SetPage } from '../pages/set/set'
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage,
    TestPage,
    ModalPage,
    SetPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: "md",
      backButtonText: '', backButtonIcon: ''
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage,
    TestPage,
    ModalPage, SetPage
  ],
  providers: [
    StatusBar,
    ScreenOrientation,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler, },
    BLE,
    OpenNativeSettings
  ]
})
export class AppModule { }
