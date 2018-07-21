import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  isCurrentUser: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.isCurrentUser = Boolean(this.navParams.get('isCurrentUser'));
    //this.segmentType = this.navParams.get('segmentType');
  }
  delete(){
    this.navParams.get('delete')();
  }
  edit(){
    this.navParams.get('edit')();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}