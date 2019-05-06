import { Injectable, Inject } from '@angular/core';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey, StoreRating } from '@app/app/app.constant';
import moment from 'moment';
import { File } from '@ionic-native/file';

@Injectable()
export class AppRatingService {

  private someExtraVariable = 0;
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
        this.fileCtrl.createDir(StoreRating.DEVICE_FOLDER_PATH, StoreRating.FOLDER_NAME, true).then(res => {
            console.log('Check Floder RES', res);
            this.writeFile(rate);
        }).catch(err => {
            console.log('Check Floder ERR', err);
        });
    }

    writeFile(rate) {
        this.fileCtrl.writeFile(StoreRating.DEVICE_FOLDER_PATH + '/' + StoreRating.FOLDER_NAME,
            StoreRating.FILE_NAME, StoreRating.FILE_TEXT + ' = ' + rate, { replace: true }).then(res => {
                console.log('Check Write RES', res);
            }).catch(err => {
                console.log('Check Write ERR', err);
            });
    }

    checkReadFile() {
        return this.fileCtrl.readAsText(StoreRating.DEVICE_FOLDER_PATH + '/' + StoreRating.FOLDER_NAME,
            StoreRating.FILE_NAME).then(res => {
                console.log('Check Write RES', res);
                return true;
            }).catch(err => {
                console.log('Check Write ERR', err);
                return false;
            });
    }
     async rateLaterClickedCount() {
      return this.someExtraVariable = Number(await this.checkRateLaterCount());
    }
     increaseRateLaterClickedCount(value) {
      this.preference.putString(PreferenceKey.APP_RATE_LATER_CLICKED, String(value)).toPromise().then();
    }
    async checkRateLaterCount() {
     return  this.preference.getString(PreferenceKey.APP_RATE_LATER_CLICKED).toPromise().then( (val) => {
        if (val) {
          const incrementValue = Number(val) +1;
           this.increaseRateLaterClickedCount(incrementValue);
           return incrementValue;
        }
         this.increaseRateLaterClickedCount(1);
        return ;
      });
    }
}
