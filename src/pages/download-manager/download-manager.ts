import { MenuOverflow } from './../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService } from '@app/service';
import { SbPopoverComponent } from './../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { TranslateService} from '@ngx-translate/core';
import { ContentRequest, ContentService } from 'sunbird-sdk';
import { downloadsDummyData } from './downloads-spec.data';
/**
 * Generated class for the DownloadManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download-manager',
  templateUrl: 'download-manager.html',
})
export class DownloadManagerPage {

  showLoader = false;
  downloadedContentList: Array<object>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private ngZone: NgZone,
    private popoverCtrl: PopoverController,
    private commonUtilService: CommonUtilService,
    private viewCtrl: ViewController,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    ) {
      this.downloadedContentList = downloadsDummyData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadManagerPage');
  }

  showDeletePopup() {
    // this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
    //   InteractSubtype.KEBAB_MENU_CLICKED,
    //   Environment.HOME,
    //   PageId.CONTENT_DETAIL,
    //   undefined,
    //   undefined,
    //   this.objRollup,
    //   this.corRelationList);
    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('DELETE'),
      // sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('REMOVE'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      // metaInfo: this.content.contentData.name,
      sbPopoverContent: 'deleting content will remove the content from the device',
    }, {
        cssClass: 'sb-popover danger',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((canDelete: any) => {
      if (canDelete) {
        this.deleteContent();
        this.viewCtrl.dismiss();
      }
    });
  }

  deleteContent() {

  }

  showOverflowMenu(event) {
    this.popoverCtrl.create(OverflowMenuComponent, {
      list: MenuOverflow.DOWNLOAD_FILTERS
    }, {
        cssClass: 'box'
      }).present({
        ev: event
      });
  }

}
