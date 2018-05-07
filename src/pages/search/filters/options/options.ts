import { Component } from "@angular/core";
import { NavParams, ViewController, Platform } from "ionic-angular";

@Component({
  selector: 'page-filter-option',
  templateUrl: './options.html'
})
export class FilterOptions {

  facets: any
  backButtonFunc = undefined;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private platform: Platform) {
    this.facets = this.navParams.get('facet');
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  confirm() {
    this.viewCtrl.dismiss();
  }
}
