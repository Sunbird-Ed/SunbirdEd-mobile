import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TelemetryService, SyncStat } from 'sunbird';
import { Storage } from "@ionic/storage";
import { DataSyncType } from "./datasynctype.enum"

/**
 * Generated class for the DatasyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const KEY_DATA_SYNC_TYPE = "data_sync_type";
const KEY_DATA_SYNC_TIME = "data_sync_time";

@Component({
  selector: 'page-datasync',
  templateUrl: 'datasync.html',
  providers: [TelemetryService]
})
export class DatasyncPage {
  dataSyncType: DataSyncType;
  lastSyncedTime: String = "LAST_SYNCED_TIME";
  latestSync: String;

  OPTIONS: typeof DataSyncType = DataSyncType;

  constructor(public zone: NgZone, public navCtrl: NavController, public navParams: NavParams, private telemetryService: TelemetryService, private storage: Storage) {
    this.init();
  }

  private init() {
    let that = this;
    that.storage.get(KEY_DATA_SYNC_TYPE)
      .then(val => {
        if (val === undefined || val === "" || val === null) {
          return DataSyncType.off
        } else {
          return val
        }
      })
      .then(val => {
        this.dataSyncType = val

        console.error("default value - " + this.dataSyncType)
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatasyncPage');
  }

  onSelected() {
    console.log("Value - " + this.dataSyncType)
    this.storage.set(KEY_DATA_SYNC_TYPE, this.dataSyncType)
  }

  onSyncClick() {
    console.log('Sync called');
    let that = this;
    this.telemetryService.sync((response) => {

      that.zone.run(() => {
        console.log("Telemetry Data Sync : " + response);

        let syncStat: SyncStat = response.result;
        console.log("Telemetry Data Sync Time : " + syncStat.syncTime);
        let milliseconds = Number(syncStat.syncTime);

        //get date
        let date: Date = new Date(milliseconds);

        //complete date and time
        let dateAndTime: string = date.getDate() + "/" + date.getMonth() +
          "/" + date.getFullYear() + ", " + that.getTimeIn12HourFormat(date);


        that.latestSync = this.lastSyncedTime + dateAndTime;

        console.log("Telemetry Data Sync Time : " + this.latestSync);
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
}
