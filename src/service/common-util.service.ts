import { Injectable, NgZone, OnDestroy } from '@angular/core';
import {
    ToastController,
    ToastOptions,
    Popover,
    Loading,
    LoadingController,
    Events,
    PopoverController,
    Platform,
    Alert,
    AlertController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SharedPreferences, InteractType, InteractSubtype } from 'sunbird';
import { Network } from '@ionic-native/network';

import { PreferenceKey } from '../app/app.constant';
import { QRAlertCallBack } from '../pages/qrscanner/qrscanner_alert';
import { appLanguages } from './../app/app.constant';
import { QRScannerAlert } from './../pages/qrscanner/qrscanner_alert';

import { TelemetryGeneratorService } from '../service/telemetry-generator.service';
export interface NetworkInfo {
    isNetworkAvailable: boolean;
}
@Injectable()
export class CommonUtilService implements OnDestroy {
    networkInfo: NetworkInfo = {
        isNetworkAvailable: false
    };
    connectSubscription: any;
    disconnectSubscription: any;
    private alert?: Alert;
    constructor(
        private toastCtrl: ToastController,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private preferences: SharedPreferences,
        private events: Events,
        private popOverCtrl: PopoverController,
        private network: Network,
        private zone: NgZone,
        private platform: Platform,
        private alertCtrl: AlertController,
        private telemetryGeneratorService: TelemetryGeneratorService
    ) {
        this.listenForEvents();
    }

    listenForEvents() {
        this.handleNetworkAvailability();
    }

    showToast(translationKey, isInactive?, cssToast?, duration?) {
        if (Boolean(isInactive)) {
            return;
        }

        this.translate.get(translationKey).subscribe(
            (translatedMsg: any) => {
                const toastOptions: ToastOptions = {
                    message: translatedMsg,
                    duration: duration ? duration : 3000,
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
     * Method to convert Array to Comma separated string
     * @param {Array<string>} stringArray
     * @returns {string}
     */
    arrayToString(stringArray: Array<string>): string {
        return stringArray.join(', ');
    }

    /**
     * It will change the app language to given code/name if it available locally
     * @param {string} name Name of the language
     * @param {string} code language code
     */
    changeAppLanguage(name, code?) {
        if (!Boolean(code)) {
            const foundValue = appLanguages.filter(language => language.name === name);

            if (foundValue.length) {
                code = foundValue[0].code;
            }
        }

        if (code) {
            this.translate.use(code);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, code);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE, name);
        }
    }

    /**
     * Show popup with Try Again and Skip button.
     * @param {string} source Page from alert got called
     */
    showContentComingSoonAlert(source) {
        let popOver: Popover;
        const self = this;
        const callback: QRAlertCallBack = {
            tryAgain() {
                self.events.publish('event:showScanner', { pageName: source });
                popOver.dismiss();
            },
            cancel() {
                popOver.dismiss();
            }
        };
        popOver = this.popOverCtrl.create(QRScannerAlert, {
            callback: callback,
            icon: './assets/imgs/ic_coming_soon.png',
            messageKey: 'CONTENT_IS_BEING_ADDED',
            cancelKey: 'hide',
            tryAgainKey: 'TRY_DIFF_QR',
        }, {
                cssClass: 'qr-alert-invalid'
            });
        setTimeout(() => {
            popOver.present();
        }, 300);
    }

    /**
     * Its check for the network availability
     * @returns {boolean} status of the network
     */
    handleNetworkAvailability(): boolean {
        const updateNetworkAvailabilityStatus = (status: boolean) => {
            this.zone.run(() => {
                this.networkInfo.isNetworkAvailable = status;
            });
        };

        if (this.network.type === 'none') {
            updateNetworkAvailabilityStatus(false);
        } else {
            updateNetworkAvailabilityStatus(true);
        }

        this.connectSubscription = this.network.onDisconnect().subscribe(() => {
            updateNetworkAvailabilityStatus(false);
        });
        this.disconnectSubscription = this.network.onConnect().subscribe(() => {
            updateNetworkAvailabilityStatus(true);
        });

        return this.networkInfo.isNetworkAvailable;
    }

    ngOnDestroy() {
        this.connectSubscription.unsubscribe();
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * Opens In-app Browser
     * @param url - URL to open in browser or system apps
     */
    openLink(url: string): void {
        const options
            = 'hardwareback=yes,clearcache=no,zoom=no,toolbar=yes,clearsessioncache=no,closebuttoncaption=Done,disallowoverscroll=yes';

        (<any>window).cordova.InAppBrowser.open(url, '_system', options);
    }

    /**
     * @returns {string} App direction 'rtl' || 'ltr'
     */
    getAppDirection() {
        return this.platform.dir();
    }

    /**
     * It returns whether it is RTL or not
     * @returns {boolean}
     */
    isRTL() {
        return this.platform.isRTL;
    }

    /**
     * Creates a popup asking whether to exit from app or not
    */
    showExitPopUp(pageId: string, environment: string, isNavBack: boolean) {
        if (!this.alert) {
            this.alert = this.alertCtrl.create({
                title: this.translateMessage('BACK_TO_EXIT'),
                mode: 'wp',
                cssClass: 'confirm-alert',
                buttons: [
                    {
                        text: this.translateMessage('YES'),
                        cssClass: 'alert-btn-cancel',
                        handler: () => {
                            this.telemetryGeneratorService.generateInteractTelemetry(
                                InteractType.TOUCH,
                                InteractSubtype.YES_CLICKED,
                                environment,
                                pageId
                            );
                            this.platform.exitApp();
                            this.telemetryGeneratorService.generateEndTelemetry('app', '', '', environment);
                        }
                    },
                    {
                        text: this.translateMessage('NO'),
                        cssClass: 'alert-btn-delete',
                        handler: () => {
                            this.telemetryGeneratorService.generateInteractTelemetry(
                                InteractType.TOUCH,
                                InteractSubtype.NO_CLICKED,
                                environment,
                                pageId
                            );
                            if (this.alert) {
                                this.alert.dismiss();
                                this.alert = undefined;
                            }
                        }
                    }
                ]
            });
            this.alert.present();
            this.telemetryGeneratorService.generateBackClickedTelemetry(pageId, environment, isNavBack);
            return;
        } else {
            this.telemetryGeneratorService.generateBackClickedTelemetry(pageId, environment, isNavBack);
            if (this.alert) {
                this.alert.dismiss();
                this.alert = undefined;
            }
        }
    }
}
