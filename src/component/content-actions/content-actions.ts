import { TelemetryGeneratorService } from './../../service/telemetry-generator.service';
import { TranslateService } from '@ngx-translate/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { PopoverController, Events, AlertController } from 'ionic-angular/index';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import {
  ContentService,
  AuthService,
  Environment,
  Rollup,
  CorrelationData,
  InteractType,
  InteractSubtype,
  TelemetryObject
} from 'sunbird';
import { ToastController, Platform } from 'ionic-angular';
import { CommonUtilService } from '../../service/common-util.service';
import { ReportIssuesComponent } from '../report-issues/report-issues';
import { ProfileConstants } from '../../app/app.constant';
import { UnenrollAlertComponent } from '../unenroll-alert/unenroll-alert';

@Component({
  selector: 'content-actions',
  templateUrl: 'content-actions.html'
})
export class ContentActionsComponent {

  content: any;
  data: any;
  isChild = false;
  contentId: string;
  batchDetails: any;
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
    private alertctrl: AlertController,
    private events: Events,
    private translate: TranslateService,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.content = this.navParams.get('content');
    this.data = this.navParams.get('data');
    this.batchDetails = this.navParams.get('batchDetails');
    this.pageName = this.navParams.get('pageName');
    this.objRollup = this.navParams.get('objRollup');
    this.corRelationList = this.navParams.get('corRelationList');

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
        const confirm = this.alertctrl.create({
          title: this.commonUtilService.translateMessage('REMOVE_FROM_DEVICE'),
          message: this.commonUtilService.translateMessage('REMOVE_FROM_DEVICE_MSG'),
          mode: 'wp',
          cssClass: 'confirm-alert',
          buttons: [
            {
              text: this.commonUtilService.translateMessage('CANCEL'),
              role: 'cancel',
              cssClass: 'alert-btn-cancel',
              handler: () => {
                this.viewCtrl.dismiss();
              }
            },
            {
              text: this.commonUtilService.translateMessage('REMOVE'),
              cssClass: 'alert-btn-delete',
              handler: () => {
                this.deleteContent();
              },
            }
          ]
        });
        confirm.present();
        break;
      }
      case 1: {
        this.viewCtrl.dismiss();
        this.reportIssue();
        break;
      }
    }
  }

  /*
   * shows alert to confirm unenroll send back user selection */
  unenroll() {
    const popover = this.popoverCtrl.create(UnenrollAlertComponent, {}, {
      cssClass: 'confirm-alert-box'
    });
    popover.present();
    popover.onDidDismiss((unenroll: boolean = false) => {
      this.viewCtrl.dismiss({
        caller: 'unenroll',
        unenroll: unenroll
      });
    });
  }

  deleteContent() {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.content.identifier;
    telemetryObject.type = this.content.contentType;
    telemetryObject.version = this.content.pkgVersion;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_CLICKED,
      Environment.HOME,
      this.pageName,
      telemetryObject,
      undefined,
      this.objRollup,
      this.corRelationList);


    this.contentService.deleteContent(this.getDeleteRequestBody()).then((res: any) => {
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
    }).catch((error: any) => {
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
  // check wheather to show Unenroll button in overflow menu or not
  showUnenrollButton(): boolean {
    return (this.data &&
      (this.data.batchStatus !== 2 &&
        (this.data.contentStatus === 0 || this.data.contentStatus === 1 || this.data.courseProgress < 100) &&
        this.data.enrollmentType !== 'invite-only'));
  }
}
