import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapViewPage } from '../pages/map-view/map-view'
import { CreateNewAccountPage } from '../pages/create-new-account/create-new-account'
import { AngularFireModule } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserService } from '../providers/user-service'
import { LinkyModule } from 'angular-linky';

export const firebaseConfig = {
  apiKey: "AIzaSyCxf5Zqvf_19Hg2d8h9Fp8HM7qiTBrVpIM",
  authDomain: "fusecodecampchat-open.firebaseapp.com",
  databaseURL: "https://fusecodecampchat-open.firebaseio.com",
  storageBucket: "fusecodecampchat-open.appspot.com",
  messagingSenderId: "879480049917"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MapViewPage,
    CreateNewAccountPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    LinkyModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MapViewPage,
    CreateNewAccountPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, UserService]
})
export class AppModule {}
