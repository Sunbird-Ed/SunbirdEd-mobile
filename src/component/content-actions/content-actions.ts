import { CorrelationData } from './../../../genie-sdk-wrapper/src/services/telemetry/bean';
import { InteractType, InteractSubtype, PageId } from './../../../genie-sdk-wrapper/src/services/telemetry/constant';
import { TelemetryGeneratorService } from './../../service/telemetry-generator.service';
import { TranslateService } from '@ngx-translate/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { PopoverController, Events } from 'ionic-angular/index';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ContentService, AuthService, Environment, Rollup } from 'sunbird';
import { ToastController, Platform } from 'ionic-angular';
import { ReportIssuesComponent } from '../report-issues/report-issues';
import { ProfileConstants } from '../../app/app.constant';

@Component({
  selector: 'content-actions',
  templateUrl: 'content-actions.html'
})
export class ContentActionsComponent {

  content: any;
  isChild = false;
  contentId: string;
  backButtonFunc = undefined;
  userId = '';
  pageName = '';
  showFlagMenu = true;
  public objRollup: Rollup;
  private corRelationList: Array<CorrelationData>;

  constructor(
    public viewCtrl: ViewController,
    private contentService: ContentService,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private authService: AuthService,
    private events: Events,
    private translate: TranslateService,
    private platform: Platform,
    private telemetryGeneratorService: TelemetryGeneratorService) {
    this.content = this.navParams.get('content');
    this.pageName = this.navParams.get('pageName');
    // objRollup: this.objRollup,
    //   corRelationList: this.corRelationList
    this.objRollup = this.navParams.get('objRollup');
    this.corRelationList = this.navParams.get('corRelationList');

    console.log('objectRollup', this.objRollup);
    console.log('corRelationList', this.corRelationList);

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
      if (session === null || session === 'null') {
        this.userId = '';
      } else {
        const res = JSON.parse(session);
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
    const apiParams = {
      contentDeleteList: [{
        contentId: this.contentId,
        isChildContent: this.isChild
      }]
    };
    return apiParams;
  }

  /**
   * Close popover
   */
  close(i) {
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
    console.log('objectRollup', this.objRollup);
    console.log('corRelationList', this.corRelationList);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_CLICKED,
      Environment.HOME,
      this.pageName,
      undefined,
      undefined,
      this.objRollup,
      this.corRelationList);


    this.contentService.deleteContent(this.getDeleteRequestBody(), (res: any) => {
      const data = JSON.parse(res);
      if (data.result && data.result.status === 'NOT_FOUND') {
        this.showToaster(this.getMessageByConstant('CONTENT_DELETE_FAILED'));
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
      this.showToaster(this.getMessageByConstant('CONTENT_DELETE_FAILED'));
      this.viewCtrl.dismiss();
    });
  }

  reportIssue() {
    const popUp = this.popoverCtrl.create(ReportIssuesComponent, {
      content: this.content
    }, {
        cssClass: 'report-issue-box'
      });
    popUp.present();
  }

  showToaster(message) {
    const toast = this.toastCtrl.create({
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
