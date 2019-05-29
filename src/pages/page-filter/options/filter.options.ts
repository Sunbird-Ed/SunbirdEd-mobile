import { AppGlobalService } from './../../../service/app-global.service';
import { Component } from '@angular/core';
import {
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';
import { PageAssembleFilter } from 'sunbird-sdk';
@Component({
  selector: 'page-filter-options',
  templateUrl: './filter.options.html'
})
export class PageFilterOptions {
  pagetAssemblefilter: PageAssembleFilter = {};
  facets: any;
  backButtonFunc = undefined;
  selected: boolean;
  topicsSelected: any[];
  items: any[];

  shownGroup = null;
  topicsArr = [];
  topicsVal = [];
  filteredTopicArr = [];
  showTopicFilterList = false;
  prevSelectedTopic = [];
  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private appGlobalService: AppGlobalService,
    private platform: Platform) {

    this.facets = this.navParams.get('facets');
    if ( this.facets.name === 'Topic') {

        // tslint:disable-next-line:forin
        for ( let i = 0; i < this.facets.values.length; i++) {
          this.topicsArr.push(Object.keys(this.facets.values[i])[0]);
          this.topicsVal.push(this.facets.values[i][ this.topicsArr[i]]);
        }
        if (this.facets.selected) {
          this.prevSelectedTopic = [...this.facets.selected] ;
        }

    }
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
      if (!this.appGlobalService.isUserLoggedIn() && this.facets.code === 'board') {
        this.facets.selected = [];
      }
      this.facets.selected.push(value);
      if (this.facets.code === 'contentType') {
        this.facets.selectedValuesIndices.push(index);
      }
    }

  }

  confirm() {
    this.viewCtrl.dismiss();
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }
  isGroupShown(group) {
    return this.shownGroup === group;
  }

  getItems(ev: any) {
    this.filteredTopicArr = [];
    let val = ev.srcElement.value;
    if (val && val.trim() !== '') {
      val = val.toLowerCase();
      this.showTopicFilterList = true;
    for ( let i = 0; i < this.topicsVal.length; i++) {
      let filtered = [];
      filtered = this.topicsVal[i].filter((item) => {
        return (item.name.toString().toLowerCase().match(val));
      });
      if (filtered.length > 0) {
        for (let j = 0; j < filtered.length; j++) {
          this.filteredTopicArr.push(filtered[j]);
      }
        filtered = [];
      }
    }
  } else {
    this.showTopicFilterList = false;
    this.filteredTopicArr = [];
  }
  }

  getSelectedOptionCount(facet) {
    if (facet.selected && facet.selected.length > 0) {
      this.pagetAssemblefilter[facet.code] = facet.selected;
      return `${facet.selected.length}`;
    }

    return '';
  }

  cancel() {
    this.facets.selected = [...this.prevSelectedTopic];
    this.viewCtrl.dismiss();
  }
  apply() {
      this.prevSelectedTopic = [...this.facets.selected];
      this.confirm();
  }
}
