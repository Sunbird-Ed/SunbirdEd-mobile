import { Injectable, Inject } from '@angular/core';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey } from '@app/app/app.constant';
import moment from 'moment';

@Injectable()
export class AppRatingService {

    /** Number of Days */
    readonly APP_RATING_DATE_DIFF = 2;
    readonly APP_MIN_RATE = 4;

    constructor(
        @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
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

    setEndAppRate() {

    }

}
