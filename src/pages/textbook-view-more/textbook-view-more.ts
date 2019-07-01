import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppHeaderService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { Observable, Subscription } from 'rxjs';
import { TelemetryObject } from 'sunbird-sdk';
import { Environment, InteractSubtype, InteractType, PageId, ImpressionType, ImpressionSubtype } from '../../service/telemetry-constants';
import { CollectionDetailsEtbPage } from './../collection-details-etb/collection-details-etb';
/**
 * Generated class for the TextbookViewMorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-textbook-view-more',
  templateUrl: 'textbook-view-more.html',
})
export class TextbookViewMorePage {
  content: any;
  subjectName: any;
  toast: any;
  layoutName = 'textbook';
  // header
  private _appHeaderSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private headerService: AppHeaderService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private toastController: ToastController) {
    this.content = this.navParams.get('content');
    this.subjectName = this.navParams.get('subjectName');
  }
  ionViewWillEnter() {
    this.initAppHeader();
  }

  ionViewDidLoad() {
    console.log('CONTENT', this.content);
  }
  private initAppHeader() {
    this._appHeaderSubscription = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this._headerConfig = this.headerService.getDefaultPageConfig();
    this._headerConfig.actionButtons = [];
    this._headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this._headerConfig);
  }

  private handleHeaderEvents(event: { name: string }) {
    switch (event.name) {
      case 'back':
        this.navCtrl.pop();
        break;
    }
  }

  navigateToDetailPage(item, index, sectionName) {
    const identifier = item.contentId || item.identifier;
    let telemetryObject: TelemetryObject;
    telemetryObject = new TelemetryObject(identifier, item.contentType, undefined);

    const values = new Map();
    values['sectionName'] = item.subject;
    values['positionClicked'] = index;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      Environment.Home,
      PageId.Library,
      telemetryObject,
      values);
    if (this.commonUtilService.networkInfo.isNetworkAvailable || item.isAvailableLocally) {
      this.navCtrl.push(CollectionDetailsEtbPage, {
        content: item
      });
    } else {
      this.presentToastForOffline('OFFLINE_WARNING_ETBUI_1');
    }
  }


  // Offline Toast
  presentToastForOffline(msg: string) {
    this.toast = this.toastController.create({
      duration: 3000,
      message: this.commonUtilService.translateMessage(msg),
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastHeader'
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = undefined;
    });
  }


}
