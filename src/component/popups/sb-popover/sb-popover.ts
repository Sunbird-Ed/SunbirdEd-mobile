import { Component } from '@angular/core';
import { ContentActionsComponent } from '@app/component';
import {
  NavParams,
  ViewController,
  ToastController,
  Events,
  Platform
} from 'ionic-angular';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileConstants } from '../../../app/app.constant';
import { Rollup, CorrelationData, ContentService, AuthService } from 'sunbird-sdk';

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
  isNotShowCloseIcon: boolean;
  img: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams,
    private platform: Platform, private events: Events) {
    this.img = this.navParams.get('img');
    this.isNotShowCloseIcon = this.navParams.get('isNotShowCloseIcon') ? true : false;
    this.content = this.navParams.get('content');
    this.actionsButtons = this.navParams.get('actionsButtons');
    this.icon = this.navParams.get('icon');
    this.metaInfo = this.navParams.get('metaInfo');
    this.sbPopoverContent = this.navParams.get('sbPopoverContent');
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMainTitle = this.navParams.get('sbPopoverMainTitle');

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
  }

  ionViewWillEnter(): void {
    this.events.subscribe('deletedContentList:changed', (data) => {
      this.sbPopoverMainTitle = data.deletedContentsInfo.deletedCount + '/' + data.deletedContentsInfo.totalCount;
    });
  }

  ionViewWillLeave(): void {
    this.events.unsubscribe('deletedContentList:changed');
  }

  closePopover() {
    this.viewCtrl.dismiss();
  }
  deleteContent(candelete: boolean = false, whichbtnClicked?) {
    this.viewCtrl.dismiss(candelete);
    if (this.navParams.get('handler')) {
      this.navParams.get('handler')(whichbtnClicked);
    }
  }
}
