import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service'
import { CreateNewAccountPage } from '../create-new-account/create-new-account'
import { NotificationService } from '../../providers/notification-service'
import { User } from '../../models/user'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [NotificationService]
})
export class LoginPage {
  public loginUser: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public notificationService: NotificationService) {
    this.loginUser = new User();
  }

  public login() {
    this.userService.getUserFromFireBaseByUserName(this.loginUser.name).then((userDataReturned) => {
      if (userDataReturned && userDataReturned[0]) {
        this.handleSetCurrentUser(userDataReturned[0]);
        this.navCtrl.pop();
      } else {
        this.handleLoginFailed();
      }
    }, () => {
      this.handleLoginFailed();
    });
  }

  private handleSetCurrentUser(passedUser) {
    let currentUser = new User();
    currentUser.$key = passedUser.$key;
    currentUser.name = passedUser.name;
    currentUser.photo = passedUser.photo;
    this.userService.setCurrentUser(currentUser);
  }

  public createNewAccount() {
    this.navCtrl.push(CreateNewAccountPage);
  }

  private handleLoginFailed() {
    this.notificationService.showMessage('Login failed');
  }
}
