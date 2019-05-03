import { AppHeaderService } from '@app/service';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  trustedVideoUrl: SafeResourceUrl;

  video: any = {
    url: 'https://ankur01oct.github.io/index.html?selectedlang=en'
  };
  constructor(public navCtrl: NavController,
              private domSanitizer: DomSanitizer) {
  }

  ionViewWillEnter(): void {
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);
    (<any>window).addEventListener('message', this.receiveMessage, false);
  }

  receiveMessage(event) {
  console.log('event', event.data);
}

}
