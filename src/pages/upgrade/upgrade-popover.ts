import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
@Component({
    selector: 'upgrade-popover',
    templateUrl: 'upgrade-popover.html'
})

export class UpgradePopover {

    upgradeType: any;

    upgradeTitle: string;
    upgradeContent: string;
    isMandatoryUpgrade: boolean = false;

    constructor(private navParams: NavParams,
        public viewCtrl: ViewController) {
        this.upgradeType = this.navParams.get('type');

        console.log("Upgrade type in Popover  - type - " + JSON.stringify(this.upgradeType));

        if (this.upgradeType.optional === "forceful") {
            this.isMandatoryUpgrade = true;
        }

    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    upgrade() {
        this.viewCtrl.dismiss();
    }

}