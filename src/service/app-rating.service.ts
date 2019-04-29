import { Injectable, Inject } from '@angular/core';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey, StoreRatingConstants } from '@app/app/app.constant';
import moment from 'moment';
import { File } from '@ionic-native/file';

@Injectable()
export class AppRatingService {

    readonly APP_RATING_DATE_DIFF = 2;
    readonly APP_MIN_RATE = 4;
    readonly APP_RATING_FOLDER_NAME = 'sunbird-apprating';
    readonly APP_RATING_FILE_NAME = 'app-rating.doc';
    readonly APP_RATING_FILE_TEXT = 'APP-Rating';
    readonly DEVICE_FOLDER_PATH = cordova.file.dataDirectory;


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

    setEndStoreRate() {
        this.createFolder();
    }

    createFolder() {
        this.fileCtrl.createDir(this.DEVICE_FOLDER_PATH, StoreRatingConstants.FOLDER_NAME, true).then(res => {
            console.log('Check Floder RES', res);
            this.writeFile();
        }).catch(err => {
            console.log('Check Floder ERR', err);
        });
    }

    writeFile() {
        this.fileCtrl.writeFile(StoreRatingConstants.DEVICE_FOLDER_PATH + '/' + StoreRatingConstants.FOLDER_NAME,
            StoreRatingConstants.FILE_NAME, StoreRatingConstants.FILE_TEXT, { replace: true }).then(res => {
                console.log('Check Write RES', res);
            }).catch(err => {
                console.log('Check Write ERR', err);
            });
    }

    checkReadFile() {
        return this.fileCtrl.readAsText(StoreRatingConstants.DEVICE_FOLDER_PATH + '/' + StoreRatingConstants.FOLDER_NAME,
            StoreRatingConstants.FILE_NAME).then(res => {
                console.log('Check Write RES', res);
                return (res === this.APP_RATING_FILE_TEXT) ? true : false;
            }).catch(err => {
                console.log('Check Write ERR', err);
                return false;
            });
    }

}
