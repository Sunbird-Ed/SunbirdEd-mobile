import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the GroupDetailNavPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-detail-nav-popover',
  templateUrl: 'group-detail-nav-popover.html',
})
export class GroupDetailNavPopoverPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService
  ) {
  }

  

}
