import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CommonUtilService {

    constructor(private toastCtrl: ToastController,
        private translate: TranslateService) {
    }



    showToast(translationKey, isInactive?) {
        if (Boolean(isInactive)) {
            return;
        }
        this.translate.get(translationKey).subscribe(
            (value: any) => {
                let toast = this.toastCtrl.create({
                    message: value,
                    duration: 3000,
                    position: 'bottom'
                });
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
     * 
     * @param {string} translations Stringified object of translations 
     * @param {string} defaultValue Fallback value if does not have translations
     * @returns {string} Translated values or fallback value
     */
    getTranslatedValue(translations: string, defaultValue: string) {
        let availableTranslation = JSON.parse(translations);
        if (availableTranslation.hasOwnProperty(this.translate.currentLang)) {
            return availableTranslation[this.translate.currentLang];
        }
        return defaultValue;
    }
}