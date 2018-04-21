import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TelemetryService, SyncStat, SharedPreferences, PageId, Environment, ImpressionType, Impression, Interact, InteractType, InteractSubtype } from 'sunbird';
import { DataSyncType } from "./datasynctype.enum"
import { TranslateService } from '@ngx-translate/core'

/**
 * Generated class for the DatasyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const KEY_DATA_SYNC_TYPE = "data_sync_type";
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
  latestSync: String;

  OPTIONS: typeof DataSyncType = DataSyncType;

  constructor(public zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private telemetryService: TelemetryService,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private loadingCtrl: LoadingController) {
  }

  private init() {
    let that = this;

    //fetch the string 
    this.translate.get('LAST_SYNC').subscribe(value => {
      this.lastSyncedTimeString = value;

      //check what was the last sync time
      this.preference.getString(KEY_DATA_SYNC_TIME, val => {
        if (val === undefined || val === "" || val === null) {
          this.latestSync = "";
        } else {
          this.latestSync = this.lastSyncedTimeString + " " + val
        }
      });
    });

    //check what sync option is selected
    that.preference.getString(KEY_DATA_SYNC_TYPE, val => {
      if (val === undefined || val === "" || val === null) {
        this.dataSyncType = DataSyncType.off
      } else {
        this.dataSyncType = DataSyncType[val];
      }
    });
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
  }

  onSelected() {
    console.log("Value - " + this.dataSyncType)
    this.preference.putString(KEY_DATA_SYNC_TYPE, this.dataSyncType)
  }

  goBack() {
    this.navCtrl.pop();
  }

  onSyncClick() {
    console.log('Sync called');
    let that = this;
    let loader = this.getLoader();
    loader.present();
    this.generateInteractEvent(InteractType.TOUCH,InteractSubtype.MANUALSYNC_INITIATED,null);
    this.telemetryService.sync((response) => {

      that.zone.run(() => {
        console.log("Telemetry Data Sync : " + response);
       
        let syncStat: SyncStat = response.result;
        this.generateInteractEvent(InteractType.OTHER,InteractSubtype.MANUALSYNC_SUCCESS,syncStat.syncedFileSize.toString());
        console.log("Telemetry Data Sync Time : " + syncStat.syncTime);
        let milliseconds = Number(syncStat.syncTime);

        //get date
        let date: Date = new Date(milliseconds);

        let month: Number = date.getMonth() + 1

        //complete date and time
        let dateAndTime: string = date.getDate() + "/" + month +
          "/" + date.getFullYear() + ", " + that.getTimeIn12HourFormat(date);

        that.latestSync = this.lastSyncedTimeString + " " + dateAndTime

        //store the latest sync time
        this.preference.putString(KEY_DATA_SYNC_TIME, dateAndTime)

        console.log("Telemetry Data Sync Time : " + this.latestSync);
        loader.dismiss()
      });


    }, (error) => {
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

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS_DATASYNC;
    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(impression);
  }

  generateInteractEvent(interactType: string, subtype: string, size: string) {
    let interact = new Interact();
    interact.type = interactType;
    interact.subType = subtype;
    if (size != null) {
      let valuesMap = new CMap();
      valuesMap["SizeOfFileInKB"] = size;
      interact.valueMap=valuesMap;
    }
    this.telemetryService.interact(interact);
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      spinner: "crescent"
    });
  }
}
