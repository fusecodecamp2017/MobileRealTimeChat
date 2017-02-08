import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service'
import { User } from '../../models/user'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public userBeingEdited: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService) {
    this.setupUserBeingEdited()
  }

  private setupUserBeingEdited() {
    if (this.userService.currentUser) {
      this.userBeingEdited = this.userService.currentUser;
    } else {
      this.userBeingEdited = new User();
    }
  }

  public save() {
    this.userService.registerCurrentUser(this.userBeingEdited);
    this.navCtrl.pop();
  }
}
