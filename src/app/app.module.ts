import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { LinkyModule } from 'angular-linky';

// export const firebaseConfig = {
//   apiKey: "AIzaSyCxf5Zqvf_19Hg2d8h9Fp8HM7qiTBrVpIM",
//   authDomain: "fusecodecampchat-open.firebaseapp.com",
//   databaseURL: "https://fusecodecampchat-open.firebaseio.com",
//   storageBucket: "fusecodecampchat-open.appspot.com",
//   messagingSenderId: "879480049917"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyAodUEwbHfobnTgmCyWffxDhr7csJzBO4I",
  authDomain: "fusecodecampchat.firebaseapp.com",
  databaseURL: "https://fusecodecampchat.firebaseio.com",
  storageBucket: "fusecodecampchat.appspot.com",
  messagingSenderId: "117335825122"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    LinkyModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule { }