import { appLanguages } from './../app/app.constant';
import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import {
    ToastController,
    ToastOptions
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Loading } from 'ionic-angular';
import * as _ from 'lodash';
import { SharedPreferences } from 'sunbird';
import { PreferenceKey } from '../app/app.constant';

@Injectable()
export class CommonUtilService {

    constructor(
        private toastCtrl: ToastController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private preferences: SharedPreferences
    ) {
    }

    showToast(translationKey, isInactive?, cssToast?) {
        if (Boolean(isInactive)) {
            return;
        }

        this.translate.get(translationKey).subscribe(
            (translatedMsg: any) => {
                const toastOptions: ToastOptions = {
                    message: translatedMsg,
                    duration: 3000,
                    position: 'bottom',
                    cssClass: cssToast ? cssToast : ''
                };

                const toast = this.toastCtrl.create(toastOptions);
                toast.present();
            }
        );
    }

    /**
     * Used to Translate message to current Language
     * @param {string} messageConst - Message Constant to be translated
     * @returns {string} translatedMsg - Translated Message
     */
    translateMessage(messageConst: string, field?: string): string {
        let translatedMsg = '';
        this.translate.get(messageConst, { '%s': field }).subscribe(
            (value: any) => {
                translatedMsg = value;
            }
        );
        return translatedMsg;
    }

    /**
     * @param {string} translations Stringified object of translations
     * @param {string} defaultValue Fallback value if does not have translations
     * @returns {string} Translated values or fallback value
     */
    getTranslatedValue(translations: string, defaultValue: string) {
        const availableTranslation = JSON.parse(translations);
        if (availableTranslation.hasOwnProperty(this.translate.currentLang)) {
            return availableTranslation[this.translate.currentLang];
        }
        return defaultValue;
    }

    /**
     * Returns Loading object with default config
     * @returns {object} Loading object
     */
    getLoader(): Loading {
        return this.loadingCtrl.create({
            duration: 30000,
            spinner: 'crescent'
        });
    }

    /**
     * @param {string} str Input String that need to convert into the Array
     * @returns {array} Newly created Array
     */
    stringToArray(str: string = '') {
        return _.split(str, ', ');
    }

    /**
     * It will change the app language to given code/name if it available locally
     * @param {string} name Name of the language
     * @param {string} code language code
     */
    changeAppLanguage(name, code?) {
        if (!Boolean(code)) {
            const foundValue = appLanguages.filter(language => language.name === name);
            code = foundValue[0].code;
        }

        if (code) {
            this.translate.use(code);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, code);
        }
    }
}
