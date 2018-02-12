import { BrowserTab } from "@ionic-native/browser-tab";
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { TabsPage } from '../../core/container/tabs/tabs';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the OnboardingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  slides: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.slides = [
      {
        'title': 'Get Content On-the-Go',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'Browse and consume content from our growing collection of free courses and resources.',
        'viewable': true
      },
      {
        'title': 'Get Content On-the-Go',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'Browse and consume content from our growing collection of free courses and resources.',
        'viewable': false
      },
      {
        'title': 'Scan QR Codes for Quick Access',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'Scan QR Codes using the Sunbird app to quickly get access to related content and resources.',
        'viewable': true
      },
      {
        'title': 'Content with Peers and Experts',
        'imageUri': 'assets/imgs/logo.png',
        'desc': 'Join communities and speak to peers and experts. Learn and sahre your knowledge',
        'viewable': true
      },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  singin() {
    this.navCtrl.push(TabsPage, { loginMode: 'signin' })
      .then(() => {
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      });
  }

  browseAsGuest() {
    this.navCtrl.push(TabsPage, { loginMode: 'guest' })
      .then(() => {
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      });
  }

}
