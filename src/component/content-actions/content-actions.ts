import { TranslateService } from '@ngx-translate/core';
import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController, PopoverController, Events } from 'ionic-angular/index';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ContentService, AuthService } from 'sunbird';
import { ToastController, Platform } from "ionic-angular";
import { ReportIssuesComponent } from '../report-issues/report-issues';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';

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
  backButtonFunc = undefined;

  userId: string = '';
  pageName: string = '';
  showFlagMenu: boolean = true;

  constructor(public viewCtrl: ViewController,
    private contentService: ContentService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private authService: AuthService,
    private events: Events,
    private translate: TranslateService,
    private platform: Platform,
    private appGlobalService: AppGlobalService) {
    this.content = this.navParams.get("content");
    this.pageName = this.navParams.get('pageName');
    if (this.navParams.get('isChild')) {
      this.isChild = true;
    }

    this.contentId = (this.content && this.content.identifier) ? this.content.identifier : '';
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 20);
    this.getUserId();
  }

  getUserId() {
    this.authService.getSessionData((session: string) => {
      if (session === null || session === "null") {
        this.userId = '';
      } else {
        let res = JSON.parse(session);
        this.userId = res[ProfileConstants.USER_TOKEN] ? res[ProfileConstants.USER_TOKEN] : '';
        // Needed: this get exeuted if user is on course details page. 
        if (this.pageName === 'course' && this.userId) {
          // If course is not enrolled then hide flag/report issue menu. 
          // If course has batchId then it means it is enrolled course
          if (this.content.batchId) {
            this.showFlagMenu = true;
          } else {
            this.showFlagMenu = false;
          }
        }
      }
    });
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
