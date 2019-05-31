import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UtilityService } from '../../service/utility-service'
@Component({
    selector: 'upgrade-popover',
    templateUrl: 'upgrade-popover.html'
})

export class UpgradePopover {

    upgradeType: any;
    upgradeTitle: string;
    upgradeContent: string;
    isMandatoryUpgrade = false;

    constructor(private navParams: NavParams,
        private viewCtrl: ViewController,
        private utilityService: UtilityService) {
        this.init();
    }

    init() {
        this.upgradeType = this.navParams.get('type');

        if (this.upgradeType.optional === 'forceful') {
            this.isMandatoryUpgrade = true;
        }
    }

    cancel() {
        this.viewCtrl.dismiss();
    }

    upgrade(link) {
        const appId = link.substring(link.indexOf('=') + 1, link.lenght);
        this.utilityService.openPlayStore(appId);
        this.viewCtrl.dismiss();
    }

}
