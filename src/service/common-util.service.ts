import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CommonUtilService {

    constructor(private toastCtrl: ToastController,
        private translate: TranslateService) {
    }
    showMessage(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

    getMessageByConst(translationKey) {
        // if (!this.isVisible) {
        //     return
        // }

        this.translate.get(translationKey).subscribe(
            (value: any) => {
                this.showMessage(value);
            }
        );
    }
}