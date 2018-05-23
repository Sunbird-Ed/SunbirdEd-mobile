import { Component } from "@angular/core";
import { NavController } from 'ionic-angular';

/**
 * The incomplete profile card component
 */
@Component({
    selector: 'incomplete-profile-card',
    templateUrl: 'incomplete-profile-card.html'
})
export class IncompleteProfileCard {

    /**
     * Default method of class IncompleteProfileCard
     * 
     * @param navCtrl To navigate user from one page to another
     */
    constructor(public navCtrl: NavController) {
    }

}
