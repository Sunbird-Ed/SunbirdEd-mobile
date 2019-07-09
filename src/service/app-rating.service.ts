import { Injectable, Inject } from '@angular/core';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey, StoreRating } from '@app/app/app.constant';
import moment from 'moment';
import { File } from '@ionic-native/file';

@Injectable()
export class AppRatingService {

  private rateLaterClickCount = 0;
    constructor(
        @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
        private fileCtrl: File
    ) { }

    checkInitialDate() {
        this.preference.getString(PreferenceKey.APP_RATING_DATE).toPromise().then(res => {
            if (!res) {
                this.setInitialDate();
            }
        });
    }

    setInitialDate() {
        const presentDate = moment().format();
        this.preference.putString(PreferenceKey.APP_RATING_DATE, String(presentDate)).toPromise().then();
    }

    setEndStoreRate(rate) {
        this.createFolder(rate);
    }

    createFolder(rate) {
        this.fileCtrl.createDir(StoreRating.DEVICE_FOLDER_PATH, StoreRating.FOLDER_NAME, true)
          .then(() => {
            this.writeFile(rate);
        });
    }

    writeFile(rate) {
        this.fileCtrl.writeFile(StoreRating.DEVICE_FOLDER_PATH + '/' + StoreRating.FOLDER_NAME,
            StoreRating.FILE_NAME, StoreRating.FILE_TEXT + ' = ' + rate, { replace: true }).then(() =>{});
    }

    checkReadFile() {
         return this.fileCtrl.readAsText(StoreRating.DEVICE_FOLDER_PATH + '/' + StoreRating.FOLDER_NAME,
            StoreRating.FILE_NAME).then(() => {return true;}).catch(() => {return false;});
    }
     async rateLaterClickedCount() {
      return this.rateLaterClickCount = await this.checkRateLaterCount();
    }
    async increaseRateLaterClickedCount(value) {
      return this.preference.putString(PreferenceKey.APP_RATE_LATER_CLICKED, String(value)).toPromise().then(() => value);
    }
    async checkRateLaterCount() {
     return  this.preference.getString(PreferenceKey.APP_RATE_LATER_CLICKED).toPromise().then( async (val) => {
        if (val) {
          const incrementValue = Number(val) +1;
           await this.increaseRateLaterClickedCount(incrementValue);
           return incrementValue;
        }
        return this.increaseRateLaterClickedCount(1);
      });
    }
}
