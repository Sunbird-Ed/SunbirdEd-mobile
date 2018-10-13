import { Component } from '@angular/core';
import {
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';
@Component({
  selector: 'page-filter-options',
  templateUrl: './filter.options.html'
})
export class PageFilterOptions {
  facets: any;
  backButtonFunc = undefined;

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform) {

    this.facets = this.navParams.get('facets');
    this.handleDeviceBackButton();
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 20);
  }

  isSelected(value) {
    if (!this.facets.selected) {
      return false;
    }

    return this.facets.selected.includes(value);
  }

  changeValue(value, index) {
    if (!this.facets.selected) {
      this.facets.selected = [];
      if (this.facets.code === 'contentType') {
        this.facets.selectedValuesIndices = [];
      }
    }

    if (this.facets.selected.includes(value)) {
      index = this.facets.selected.indexOf(value);
      if (index > -1) {
        this.facets.selected.splice(index, 1);
        if (this.facets.code === 'contentType') {
          this.facets.selectedValuesIndices.splice(index, 1);
        }
      }
    } else {
      this.facets.selected.push(value);
      if (this.facets.code === 'contentType') {
        this.facets.selectedValuesIndices.push(index);
      }
    }
  }

  confirm() {
    this.viewCtrl.dismiss();
  }
}
