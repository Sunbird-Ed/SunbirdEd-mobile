import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
  selector: 'page-filter-option',
  templateUrl: './options.html'
})
export class FilterOptions {

  facets: any

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.facets = this.navParams.get('facet');
  }

  confirm() {
    this.viewCtrl.dismiss();
  }
}
