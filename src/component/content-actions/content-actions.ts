import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController, PopoverController } from 'ionic-angular/index';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ContentService } from 'sunbird';
import { ToastController } from "ionic-angular";

/**
 * Generated class for the ContentActionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'content-actions',
  templateUrl: 'content-actions.html'
})
export class ContentActionsComponent {

  content: any;

  isChild: boolean = false;

  contentId: string;

  constructor(public viewCtrl: ViewController, private contentService: ContentService,
    private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController) {
    this.content = this.navParams.get("content");
    if (this.navParams.get('isChild')) {
      this.isChild = true;
    }

    this.contentId = (this.content && this.content.identifier) ? this.content.identifier : '';
  }

  getDeleteRequestBody() {
    let apiParams = {
      contentDeleteList: [{
        contentId: this.contentId,
        isChildContent: this.isChild
      }]
    }
    console.log('Delete api request....', apiParams);
    return apiParams;
  }

  /**
   * Close popover
   */
  close(event, i) {
    switch (i) {
      case 0: {
        console.log('Delete troggered', this.content);
        this.contentService.deleteContent(this.getDeleteRequestBody(), (res: any) => {
          console.log('success data', res);
          this.viewCtrl.dismiss(i);
        }, (error: any) => {
          console.log('delete error', error);
          this.viewCtrl.dismiss(1);
        })
        break;
      }
      case 1: {
        this.viewCtrl.dismiss(i);
        break;
      }
    }
  }
}
