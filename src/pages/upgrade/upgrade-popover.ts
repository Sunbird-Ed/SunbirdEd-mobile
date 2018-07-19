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
        private viewCtrl: ViewController) {
        this.init();
    }

    init() {
        this.upgradeType = this.navParams.get('type');

        if (this.upgradeType.optional === "forceful") {
            this.isMandatoryUpgrade = true;
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    upgrade(link) {
        let appId = link.substring(link.indexOf("=") + 1, link.lenght);
        (<any>window).genieSdkUtil.openPlayStore(appId);
        this.viewCtrl.dismiss();
    }

}