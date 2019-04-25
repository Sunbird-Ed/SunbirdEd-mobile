import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { AppHeaderService } from '@app/service';

/**
 * Generated class for the ActiveDownloadsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-active-downloads',
  templateUrl: 'active-downloads.html',
})
export class ActiveDownloadsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private headerServie: AppHeaderService, private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActiveDownloadsPage');
  }

}
