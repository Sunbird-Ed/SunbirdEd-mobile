import { NavController , NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
/**
 * Generated class for the BroadcastComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'broadcast',
  templateUrl: 'broadcast.html'
})
export class BroadcastComponent {

  text: string;
  imageUrl;
  greetingText;
  customButton;
  greetings;

  constructor(private navCtrl: NavController,
              private navParams: NavParams
    ) {
    this.greetings = this.navParams.get('greetings');
    this.imageUrl = this.navParams.get('imageurl');
    this.customButton = this.navParams.get('customButton');
    this.greetingText = this.navParams.get('greetingText');
    console.log('image url', this.imageUrl);
  }

}
