import { Component } from "@angular/core";
import { NavParams, PopoverController, NavController, Events } from "ionic-angular";
import { FilterOptions } from "./options/options";

@Component({
  selector: 'page-filter',
  templateUrl: './filter.html'
})
export class FilterPage {

  filterCriteria: any;

  facetsFilter: Array<any> = [];

  constructor(private navParams: NavParams, private popCtrl: PopoverController, private navCtrl: NavController, private events: Events) {
    this.init();
  }

  openFilterOptions(facet) {
    let popUp = this.popCtrl.create(FilterOptions, { facet: facet}, {cssClass: 'option-box'});
    popUp.present();
  }

  applyFilter() {
    this.navCtrl.pop();
    this.events.publish('search.applyFilter', this.filterCriteria);
  }


  getSelectedOptionCount(facet) {
    let count = 0;

    facet.values.forEach((value) => {
      if (value.apply) {
        count += 1;
      }
    });

    if (count > 0) {
      return count + " added";
    }

    return "";
  }

  private init() {
    this.filterCriteria = this.navParams.get('filterCriteria');

    this.filterCriteria.facetFilters.forEach(facet => {
      if (facet.values && facet.values.length > 0) {
        this.facetsFilter.push(facet);
      }
    });
  }
}
