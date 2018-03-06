import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService } from 'sunbird';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { RolePage } from '../userrole/role';
import { Storage } from "@ionic/storage";

const KEY_LOGGED_IN_MODE = "logged_in_mode";

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  slides: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private auth: OAuthService,
    private storage: Storage) {

    this.slides = [
      {
        'title': 'ONBOARD_SLIDE_TITLE_1',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'ONBOARD_SLIDE_DESC_1'
      },
      {
        'title': 'ONBOARD_SLIDE_TITLE_2',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'ONBOARD_SLIDE_DESC_2'
      },
      {
        'title': 'ONBOARD_SLIDE_TITLE_3',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'ONBOARD_SLIDE_DESC_3'
      },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  singin() {
    let that = this;

    that.auth.doOAuthStepOne()
      .then(token => {
        return that.auth.doOAuthStepTwo(token);
      })
      .then(() => {
        this.storage.set(KEY_LOGGED_IN_MODE, 'signin');
        return that.navCtrl.push(RolePage);
      })
      .catch(error => {
        console.log(error);
      });

  }

  browseAsGuest() {
    this.storage.set(KEY_LOGGED_IN_MODE, 'guest');
    this.navCtrl.push(RolePage);
  }

}