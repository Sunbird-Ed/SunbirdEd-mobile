import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TelemetryService, SyncStat, SharedPreferences, PageId, Environment, ImpressionType, Impression, Interact, InteractType, InteractSubtype, ShareUtil, TelemetryStat } from 'sunbird';
import { DataSyncType } from "./datasynctype.enum"
import { TranslateService } from '@ngx-translate/core'
import { SocialSharing } from '@ionic-native/social-sharing';
import { generateImpressionTelemetry, generateInteractTelemetry } from '../../../app/telemetryutil';

/**
 * Generated class for the DatasyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const KEY_DATA_SYNC_TYPE = "sync_config";
const KEY_DATA_SYNC_TIME = "data_sync_time";

class CMap {
  [key: string]: any
}
@Component({
  selector: 'page-datasync',
  templateUrl: 'datasync.html',
  providers: [TelemetryService]
})
export class DatasyncPage {
  dataSyncType: DataSyncType;
  lastSyncedTimeString: String = "LAST_SYNC";
  latestSync: String = "";

  OPTIONS: typeof DataSyncType = DataSyncType;

  constructor(public zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private telemetryService: TelemetryService,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private toastCtrl: ToastController) {
  }

  private init() {
    let that = this;

    //fetch the string 
    this.translate.get('LAST_SYNC').subscribe(value => {
      this.lastSyncedTimeString = value;
      this.getLastSyncTime();

    });

    //check what sync option is selected
    that.preference.getString(KEY_DATA_SYNC_TYPE, val => {
      if (val === undefined || val === "" || val === null) {
        that.dataSyncType = DataSyncType.off
      } else {
        if (val === "OFF") {
          that.dataSyncType = DataSyncType.off
        }
        else if (val === "OVER_WIFI_ONLY") {
          that.dataSyncType = DataSyncType.over_wifi
        }
        else if (val === "ALWAYS_ON") {
          that.dataSyncType = DataSyncType.always_on
        }
      }
    });
  }

  ionViewDidLoad() {
    this.init();
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS_DATASYNC;
    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.SETTINGS_DATASYNC,
      Environment.SETTINGS, "", "", "",
      undefined,
      undefined
    ));
  }

  onSelected() {
    if (this.dataSyncType !== undefined) {
      this.preference.putString(KEY_DATA_SYNC_TYPE, this.dataSyncType)
    }

  }

  goBack() {
    this.navCtrl.pop();
  }

  getLastSyncTime() {
    this.telemetryService.getTelemetryStat((response: any) => {
      let that = this;
      that.zone.run(() => {
        let syncStat: TelemetryStat = JSON.parse(response).result;
        console.log("Telemetry Data Sync Time : " + syncStat.lastSyncTime);
        if (syncStat.lastSyncTime !== 0) {
          let milliseconds = Number(syncStat.lastSyncTime);

          //get date
          let date: Date = new Date(milliseconds);

          let month: Number = date.getMonth() + 1;

          //complete date and time
          let dateAndTime: string = date.getDate() + "/" + month +
            "/" + date.getFullYear() + ", " + that.getTimeIn12HourFormat(date);

          that.latestSync = this.lastSyncedTimeString + " " + dateAndTime;
        }

      });


    }, (error) => {

    });
  }

  shareTelemetry() {
    let loader = this.getLoader();
    this.shareUtil.exportTelemetry(path => {
      loader.dismiss();
      this.social.share("", "", "file://" + path, "");
    }, error => {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: this.translateMessage("SHARE_TELEMETRY_FAILED"),
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  onSyncClick() {
    console.log('Sync called');
    let that = this;
    let loader = this.getLoader();
    loader.present();
    this.generateInteractEvent(InteractType.TOUCH, InteractSubtype.MANUALSYNC_INITIATED, null);
    this.telemetryService.sync((response) => {

      that.zone.run(() => {
        console.log("Telemetry Data Sync : " + response);

        let syncStat: SyncStat = response.result;
        this.generateInteractEvent(InteractType.OTHER, InteractSubtype.MANUALSYNC_SUCCESS, syncStat.syncedFileSize.toString());
        console.log("Telemetry Data Sync Time : " + syncStat.syncTime);
        let milliseconds = Number(syncStat.syncTime);

        //get date
        let date: Date = new Date(milliseconds);

        let month: Number = date.getMonth() + 1;

        //complete date and time
        let dateAndTime: string = date.getDate() + "/" + month +
          "/" + date.getFullYear() + ", " + that.getTimeIn12HourFormat(date);

        that.latestSync = this.lastSyncedTimeString + " " + dateAndTime;

        //store the latest sync time
        this.preference.putString(KEY_DATA_SYNC_TIME, dateAndTime);

        console.log("Telemetry Data Sync Time : " + this.latestSync);
        loader.dismiss();
        this.presentToast("DATA_SYNC_SUCCESSFUL");
      });


    }, (error) => {
      loader.dismiss();
      this.presentToast("DATA_SYNC_FAILURE");
      console.log("Telemetry Data Sync Error: " + error);
    });
  }




  getTimeIn12HourFormat(time: Date): String {
    let date = new Date(time);
    let hours = date.getHours();
    let minutes: number = date.getMinutes();
    let newMinutes: string;
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    newMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
    var strTime = hours + ':' + newMinutes + ' ' + ampm;
    return strTime;
  }



  generateInteractEvent(interactType: string, subtype: string, size: string) {
    if (size != null) {
      let valuesMap = new CMap();
      valuesMap["SizeOfFileInKB"] = size;
      this.telemetryService.interact(generateInteractTelemetry(
        interactType,
        subtype,
        Environment.SETTINGS,
        PageId.SETTINGS_DATASYNC,
        valuesMap,
        undefined,
        undefined
      ));
    }
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      spinner: "crescent"
    });
  }

  presentToast(translationId) {
    let toast = this.toastCtrl.create({
      message: this.translateMessage(translationId),
      duration: 3000
    });
    toast.present();
  }

  /**
  * Used to Translate message to current Language
  * @param {string} messageConst - Message Constant to be translated
  * @returns {string} translatedMsg - Translated Message
  */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}
