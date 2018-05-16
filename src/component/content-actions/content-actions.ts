import { TranslateService } from '@ngx-translate/core';
import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController, PopoverController, Events } from 'ionic-angular/index';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ContentService } from 'sunbird';
import { ToastController } from "ionic-angular";
import { ReportIssuesComponent } from '../report-issues/report-issues';

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

  constructor(public viewCtrl: ViewController,
    private contentService: ContentService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private events: Events,
    private translate: TranslateService) {
    this.content = this.navParams.get("content");
    if (this.navParams.get('isChild')) {
      this.isChild = true;
    }

    this.contentId = (this.content && this.content.identifier) ? this.content.identifier : '';
  }

  /**
   * Construct content delete request body
   */
  getDeleteRequestBody() {
    let apiParams = {
      contentDeleteList: [{
        contentId: this.contentId,
        isChildContent: this.isChild
      }]
    }
    return apiParams;
  }

  /**
   * Close popover
   */
  close(event, i) {
    switch (i) {
      case 0: {
        this.deleteContent();
        // this.viewCtrl.dismiss();
        break;
      }
      case 1: {
        this.viewCtrl.dismiss();
        this.reportIssue();
        break;
      }
    }
  }

  deleteContent() {
    this.contentService.deleteContent(this.getDeleteRequestBody(), (res: any) => {
      let data = JSON.parse(res);
      if (data.result && data.result.status === 'NOT_FOUND') {
        this.showToaster('Content deleting failed');
      } else {
        // Publish saved resources update event
        this.events.publish('savedResources:update', {
          update: true
        });
        console.log('delete response: ', data);
        this.showToaster(this.getMessageByConstant('MSG_RESOURCE_DELETED'));
        this.viewCtrl.dismiss('delete.success');
      }
    }, (error: any) => {
      console.log('delete response: ', error);
      this.showToaster('Content deleting failed');
      this.viewCtrl.dismiss();
    })
  }

  reportIssue() {
    let popUp = this.popoverCtrl.create(ReportIssuesComponent, {
      content: this.content
    }, {
        cssClass: 'report-issue-box'
      });
    popUp.present();
  }

  showToaster(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getMessageByConstant(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }
}
