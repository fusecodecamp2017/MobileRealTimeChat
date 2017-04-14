import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../models/user'
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  public users: FirebaseListObservable<any>;
  public currentUser: User;

  constructor(private storage: Storage, private angularFire: AngularFire) {
    this.users = angularFire.database.list('/users');
  }

  public setupCurrentUser() {
    return new Promise((resolve, reject) => {
      this.storage.get('currentUserCached').then((userStoredLocally) => {
        if (userStoredLocally) {
          this.getUserFromFireBase(userStoredLocally).then((firebaseUserInfo) => {
            this.currentUser = <User>firebaseUserInfo;
            resolve(this.currentUser);
          });
        } else {
          this.currentUser = null;
          resolve(null);
        }
      }, () => {
        this.currentUser = null;
        reject(null);
      });
    });
  }

  private getUserFromFireBase(user: User) {
    return new Promise((resolve, reject) => {
      let userSubscription = this.angularFire.database.object('/users/' + user.$key).subscribe((userData) => {
        resolve(userData);
        userSubscription.unsubscribe();
      });
    });
  }

  public getUserFromFireBaseByUserName(userName: String) {
    return new Promise((resolve, reject) => {
      let queryObservable = this.angularFire.database.list('/users', {
        query: {
          orderByChild: 'name',
          equalTo: userName
        }
      });

      let userSubscription = queryObservable.subscribe((userData) => {
        userSubscription.unsubscribe();
        resolve(userData);
      });
    });
  }

  public registerCurrentUser(updatedCurrentUserInfo: User) {
    this.users.push(updatedCurrentUserInfo);
    this.setCurrentUser(updatedCurrentUserInfo);
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.storage.set('currentUserCached', this.currentUser);
  }

  public clearCurrentUser() {
    this.currentUser = null;
    this.storage.remove('currentUserCached');
  }
}
