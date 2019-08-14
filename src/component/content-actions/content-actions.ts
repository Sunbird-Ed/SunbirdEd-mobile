import {TelemetryGeneratorService} from './../../service/telemetry-generator.service';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, Events, PopoverController,NavParams} from 'ionic-angular';
import {Platform, ToastController, ViewController} from 'ionic-angular';
import {Component, Inject} from '@angular/core';
import {
  AuthService,
  ContentDeleteResponse,
  ContentDeleteStatus,
  ContentService,
  CorrelationData,
  OAuthSession,
  Rollup,
  TelemetryObject
} from 'sunbird-sdk';
import {CommonUtilService} from '../../service/common-util.service';
import {Environment, InteractSubtype, InteractType} from '../../service/telemetry-constants';
import { SbPopoverComponent } from '../popups/sb-popover/sb-popover';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { SbGenericPopoverComponent } from '../popups/sb-generic-popup/sb-generic-popover';
import moment from 'moment';
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
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private alertctrl: AlertController,
    private events: Events,
    private translate: TranslateService,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private fileSizePipe: FileSizePipe
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

  ionViewWillLeave(): void {
    this.backButtonFunc();
  }

  getUserId() {
    this.authService.getSession().subscribe((session: OAuthSession) => {
      if (!session) {
        this.userId = '';
      } else {
        this.userId = session.userToken ? session.userToken : '';
        // Needed: this get executed if user is on course details page.
        if (this.pageName === 'course' && this.userId) {
          // If course is not enrolled then hide flag/report issue menu.
          // If course has batchId then it means it is enrolled course
          this.showFlagMenu = !!this.content.batchId;
        }
      }
    });
  }

  /**
   * Construct content delete request body
   */
  getDeleteRequestBody() {
    return {
      contentDeleteList: [{
        contentId: this.contentId,
        isChildContent: this.isChild
      }]
    };
  }

  /**
   * Close popover
   */
  close(i) {
    switch (i) {
      case 0: {
        const confirm = this.popoverCtrl.create(SbPopoverComponent, {
          content: this.content,
          // isChild: this.isDepthChild,
          objRollup: this.objRollup,
          // pageName: PageId.COLLECTION_DETAIL,
          corRelationList: this.corRelationList,
          sbPopoverHeading: this.commonUtilService.translateMessage('REMOVE_FROM_DEVICE'),
          // sbPopoverMainTitle: this.commonUtilService.translateMessage('REMOVE_FROM_DEVICE_MSG'),
          sbPopoverMainTitle: this.content.name,
          actionsButtons: [
            {
              btntext: this.commonUtilService.translateMessage('REMOVE'),
              btnClass: 'popover-color'
            },
          ],
          icon: null,
          metaInfo:
          // this.contentDetail.contentTypesCount.TextBookUnit + 'items' +
          // this.batchDetails.courseAdditionalInfo.leafNodesCount + 'items' +
             '(' + this.fileSizePipe.transform(this.content.size, 2) + ')',
          sbPopoverContent: 'Are you sure you want to delete ?'
        }, {
            cssClass: 'sb-popover danger',
          });
        confirm.present({
          ev: event
        });
        confirm.onDidDismiss((canDelete: any) => {
          if (canDelete) {
            this.deleteContent();
          }
        });
        break;
      }
      case 1: {
        this.viewCtrl.dismiss();
        // this.reportIssue();
        break;
      }
    }
  }

  /*
   * shows alert to confirm unenroll send back user selection */
  unenroll() {
    const confirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('UNENROLL_FROM_COURSE'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('UNENROLL_CONFIRMATION_MESSAGE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        },
        {
          btntext: this.commonUtilService.translateMessage('CONFIRM'),
          btnClass: 'popover-color'
        }
      ],
      icon: null
    }, {
        cssClass: 'sb-popover info',
      });
      confirm.present({
        ev: event
      });
      confirm.onDidDismiss((leftBtnClicked: any) => {
        let unenroll: any = false;
        if ( leftBtnClicked == null ) {
          unenroll = false;
        } else if ( leftBtnClicked ) {
          unenroll = false;
        } else {
          unenroll = true;
        }
        this.viewCtrl.dismiss({
          caller: 'unenroll',
          unenroll: unenroll
        });
      });
  }

  deleteContent() {
    const telemetryObject = new TelemetryObject(this.content.identifier, this.content.contentType, this.content.pkgVersion);

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_CLICKED,
      Environment.HOME,
      this.pageName,
      telemetryObject,
      undefined,
      this.objRollup,
      this.corRelationList);

      const loader = this.commonUtilService.getLoader();
      loader.present();
    this.contentService.deleteContent(this.getDeleteRequestBody()).toPromise()
      .then((data: ContentDeleteResponse[]) => {
        loader.dismiss();
        if (data && data[0].status === ContentDeleteStatus.NOT_FOUND) {
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
      loader.dismiss();
      console.log('delete response: ', error);
      this.showToaster(this.getMessageByConstant('CONTENT_DELETE_FAILED'));
      this.viewCtrl.dismiss();
    });
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

  isUnenrollDisabled() {
    if (this.isObjectEmpty(this.batchDetails)) {
      return true;
    }

    if (!this.batchDetails.endDate) {
      let progress;

      if (this.data && this.data.courseProgress) {
        progress = this.data.courseProgress ? Math.round(this.data.courseProgress) : 0;
      }

      if (this.batchDetails.enrollmentType === 'open' && progress !== 100) {
        return false;
      }
      else return moment(this.batchDetails.endDate).diff(moment(new Date())) !== 0;
    }
  }

  private isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
}
