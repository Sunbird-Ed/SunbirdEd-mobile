//TODO 13/02/2018 Consider creating a common component and reuse
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { ToastController } from "ionic-angular";

@Component({
    selector: 'menu-ation',
    templateUrl: 'menu.action.html'
})

export class ActionMenuComponent {
    items: Array<string>;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private toastCtrl: ToastController) {
        this.items = this.navParams.get("list");
    }

    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            "content": event.target.innerText,
            "index": i
        }));
        switch (i) {
            case 0: {
                this.navCtrl.push(UsersnClassesComponent);
                break;
            }
            case 1: {
                let toast = this.toastCtrl.create({
                    message: 'Download Manager functionality is under progress',
                    duration: 3000,
                    position: 'bottom'
                  });
                  toast.present();
                break;
            }
        }
    }

}