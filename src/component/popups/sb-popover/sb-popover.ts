import { Component } from '@angular/core';
import { ContentActionsComponent } from '@app/component';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import {
  NavParams,
  ToastController,
  Platform
} from 'ionic-angular';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { TelemetryObject , ContentService, AuthService, Environment, Rollup, CorrelationData, InteractType, InteractSubtype} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular/index';
import { ProfileConstants } from '../../../app/app.constant';

/**
 * Generated class for the PopupsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sb-popover',
  templateUrl: 'sb-popover.html'
})
export class SbPopoverComponent {

  sbPopoverHeading: any;
  sbPopoverMainTitle: any;
  sbPopoverContent: any;
  actionsButtons: any;
  icon: any;
  metaInfo: any;
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


  constructor(public viewCtrl: ViewController, public navParams: NavParams,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private contentService: ContentService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private events: Events,
    private authService: AuthService,
    private platform: Platform) {
    this.content = this.navParams.get('content');
    this.actionsButtons = this.navParams.get('actionsButtons');
    this.icon = this.navParams.get('icon');
    this.metaInfo = this.navParams.get('metaInfo');
    this.sbPopoverContent = this.navParams.get('sbPopoverContent');
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMainTitle = this.navParams.get('sbPopoverMainTitle');
    console.log('this.actionsButtons', this.actionsButtons);
    console.log('this.sbPopoverMainTitle', this.sbPopoverMainTitle);

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

  closePopover() {
    this.viewCtrl.dismiss();
  }
  deletecontent(candelete: boolean = false) {
    this.viewCtrl.dismiss(candelete);
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
}
