import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { User } from "../models/user"
import { Platform } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthorizationService {
  private authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth, private platform: Platform, private facebook: Facebook) {
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  public authenticated(): boolean {
    return this.authState !== null;
  }

  public login(): void {
    if (this.platform.is('cordova')) {
      this.facebook.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      });
    } else {
      this.auth$.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      });
    }
  }

  public logout(): void {
    this.auth$.logout();
  }

  public getUserInfo(): User {
    if (this.authState != null) {
      return this.translateAuthInfoToUser(this.authState.facebook);
    } else {
      return null;
    }
  }

  private translateAuthInfoToUser(authInfo): User {
    let user = new User();
    user.uid = authInfo.uid;
    user.displayName = authInfo.displayName;
    user.photoURL = authInfo.photoURL;
    return user;
  }

  public currentUid(): string {
    if (this.authState != null) {
      return this.authState.facebook.uid;
    } else {
      return null;
    }
  }
}