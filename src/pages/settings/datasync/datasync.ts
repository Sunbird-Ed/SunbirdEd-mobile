import { CommonUtilService } from './../../../service/common-util.service';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {
  TelemetryService,
  SyncStat,
  SharedPreferences,
  PageId,
  Environment,
  ImpressionType,
  Impression,
  InteractType,
  InteractSubtype,
  ShareUtil,
  TelemetryStat
} from 'sunbird';
import { DataSyncType } from './datasynctype.enum';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { generateImpressionTelemetry, generateInteractTelemetry } from '../../../app/telemetryutil';

const KEY_DATA_SYNC_TYPE = 'sync_config';
const KEY_DATA_SYNC_TIME = 'data_sync_time';

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
  lastSyncedTimeString = 'LAST_SYNC';
  latestSync = '';

  OPTIONS: typeof DataSyncType = DataSyncType;

  constructor(
    public zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private telemetryService: TelemetryService,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private commonUtilService: CommonUtilService
  ) { }

  init() {
    const that = this;
    this.lastSyncedTimeString = this.commonUtilService.translateMessage('LAST_SYNC');
    this.getLastSyncTime();

    // check what sync option is selected
    that.preference.getString(KEY_DATA_SYNC_TYPE)
      .then(val => {
        if (Boolean(val)) {
          if (val === 'OFF') {
            that.dataSyncType = DataSyncType.off;
          } else if (val === 'OVER_WIFI_ONLY') {
            that.dataSyncType = DataSyncType.over_wifi;
          } else if (val === 'ALWAYS_ON') {
            that.dataSyncType = DataSyncType.always_on;
          }
        } else {
          that.dataSyncType = DataSyncType.off;
        }
      });
  }

  ionViewDidLoad() {
    this.init();
    const impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS_DATASYNC;
    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.SETTINGS_DATASYNC,
      Environment.SETTINGS, '', '', '',
      undefined,
      undefined
    ));
  }

  onSelected() {
    /*istanbul ignore else */
    if (this.dataSyncType !== undefined) {
      this.preference.putString(KEY_DATA_SYNC_TYPE, this.dataSyncType);
    }
  }

  getLastSyncTime() {
    this.telemetryService.getTelemetryStat().then((response: any) => {
      const that = this;
      that.zone.run(() => {
        const syncStat: TelemetryStat = JSON.parse(response).result;

        if (syncStat.lastSyncTime !== 0) {
          const milliseconds = Number(syncStat.lastSyncTime);

          // get date
          const date: Date = new Date(milliseconds);
          const month: Number = date.getMonth() + 1;

          // complete date and time
          const dateAndTime: string = date.getDate() + '/' + month +
            '/' + date.getFullYear() + ', ' + that.getTimeIn12HourFormat(date);
          that.latestSync = this.lastSyncedTimeString + ' ' + dateAndTime;
        }
      });
    }) .catch(() => {
    });
  }

  shareTelemetry() {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.shareUtil.exportTelemetry(path => {
      loader.dismiss();
      this.social.share('', '', 'file://' + path, '');
    }, () => {
      loader.dismiss();
      this.commonUtilService.showToast('SHARE_TELEMETRY_FAILED');
    });
  }

  onSyncClick() {
    const that = this;
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.generateInteractEvent(InteractType.TOUCH, InteractSubtype.MANUALSYNC_INITIATED, null);
    this.telemetryService.sync()
      .then((response: any) => {

        that.zone.run(() => {
          const syncStat: SyncStat = response.result;
          this.generateInteractEvent(InteractType.OTHER, InteractSubtype.MANUALSYNC_SUCCESS, syncStat.syncedFileSize.toString());
          const milliseconds = Number(syncStat.syncTime);

          // get date
          const date: Date = new Date(milliseconds);
          const month: Number = date.getMonth() + 1;

          // complete date and time
          const dateAndTime: string = date.getDate() + '/' + month +
            '/' + date.getFullYear() + ', ' + that.getTimeIn12HourFormat(date);

          that.latestSync = this.lastSyncedTimeString + ' ' + dateAndTime;

          // store the latest sync time
          this.preference.putString(KEY_DATA_SYNC_TIME, dateAndTime);

          loader.dismiss();
          this.commonUtilService.showToast('DATA_SYNC_SUCCESSFUL');
        });
      })
      .catch((error) => {
        loader.dismiss();
        this.commonUtilService.showToast('DATA_SYNC_FAILURE');
        console.error('Telemetry Data Sync Error: ' + error);
      });
  }




  getTimeIn12HourFormat(time: Date): string {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes: number = date.getMinutes();
    let newMinutes: string;
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    newMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
    const strTime = hours + ':' + newMinutes + ' ' + ampm;

    return strTime;
  }



  generateInteractEvent(interactType: string, subtype: string, size: string) {
    /*istanbul ignore else */
    if (size != null) {
      const valuesMap = new CMap();
      valuesMap['SizeOfFileInKB'] = size;
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
}
