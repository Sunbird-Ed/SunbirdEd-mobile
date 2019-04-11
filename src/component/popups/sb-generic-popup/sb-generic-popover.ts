import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {
  NavParams,
  Platform
} from 'ionic-angular';


/**
 * Generated class for the PopupsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sb-generic-popover',
  templateUrl: 'sb-generic-popover.html'
})
export class SbGenericPopoverComponent {

  sbPopoverHeading: any;
  sbPopoverMainTitle: any;
  sbPopoverContent: any;
  actionsButtons: any;
  icon: any;
  metaInfo: any;
  backButtonFunc = undefined;


  constructor(public viewCtrl: ViewController, public navParams: NavParams,
    private platform: Platform) {

    this.actionsButtons = this.navParams.get('actionsButtons');
    this.icon = this.navParams.get('icon');
    this.metaInfo = this.navParams.get('metaInfo');
    this.sbPopoverContent = this.navParams.get('sbPopoverContent');
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMainTitle = this.navParams.get('sbPopoverMainTitle');

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss(null);
      this.backButtonFunc();
    }, 20);
  }

  closePopover() {
    this.viewCtrl.dismiss(null);
  }
  deletecontent(btnIndex: number = 0) {
    if (btnIndex === 0) {
      this.viewCtrl.dismiss(true);
    } else {
      this.viewCtrl.dismiss(false);
    }
  }
}
