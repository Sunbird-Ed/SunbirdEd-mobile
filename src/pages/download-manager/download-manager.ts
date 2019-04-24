import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService} from '@ngx-translate/core';
/**
 * Generated class for the DownloadManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download-manager',
  templateUrl: 'download-manager.html',
})
export class DownloadManagerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams ,  private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadManagerPage');
  }

}
