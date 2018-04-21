import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { ToastController } from "ionic-angular";
import { SettingsPage } from "../../settings/settings";
import { OAuthService } from "sunbird";
import { OnboardingPage } from "../../onboarding/onboarding";

@Component({
    selector: 'menu-overflow',
    templateUrl: 'menu.overflow.html'
})

export class OverflowMenuComponent {
    items: Array<string>;
    
    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        public viewCtrl: ViewController, 
        private toastCtrl: ToastController,
        private oauth: OAuthService) {
        this.items = this.navParams.get("list");
    }
     
    showToast(toastCtrl: ToastController, message: String) {
        
    }
    
    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            "content": event.target.innerText,
            "index": i
        }));
        switch (i) {
            // case 0: {
            //     this.navCtrl.push(UsersnClassesComponent);
            //     break;
            // }
            // case 1: {
            //     let toast = this.toastCtrl.create({
            //         message: 'Download Manager functionality is under progress',
            //         duration: 3000,
            //         position: 'bottom'
            //       });
            //       toast.present();
            //     break;
            // }
            case 0: {
                  this.navCtrl.push(SettingsPage)
                break;
            }
            case 1: {
                // let toast = this.toastCtrl.create({
                //     message: 'Sign Out functionality is under progress',
                //     duration: 3000,
                //     position: 'bottom'
                //   });
                //   toast.present();
                this.oauth.doLogOut();
                this.navCtrl.setRoot(OnboardingPage);
                break;
            }

        }
    }
     
}