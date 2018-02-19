import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LanguageSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-language-setting',
  templateUrl: 'language-setting.html',
})
export class LanguageSettingPage {

  languages : any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.languages = [
      {
        'label' : 'English',
        'code' : 'en',
        'isApplied' : true
      },
      {
        'label' : 'हिंदी',
        'code' : 'hi',
        'isApplied' : false
      },
      {
        'label' : 'తెలుగు',
        'code' : 'te',
        'isApplied' : false
      },
      {
        'label' : 'தமிழ்',
        'code' : 'ta',
        'isApplied' : false
      },
      {
        'label' : 'मराठी',
        'code' : 'mr',
        'isApplied' : false
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

}
