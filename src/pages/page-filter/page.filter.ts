import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams, Platform } from "ionic-angular";
import { AppGlobalService } from "../../service/app-global.service";
import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";

import {
  PageAssembleFilter,
  TelemetryService,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  CategoryRequest,
  FrameworkService,
} from "sunbird";
import { PageFilterOptions } from "./options/filter.options";
import { generateInteractTelemetry } from "../../app/telemetryutil";
import * as frameworkDataList from "../../config/framework.filters";

@Component({
  selector: 'page-filter',
  templateUrl: './page.filter.html'
})
export class PageFilter {
  pagetAssemblefilter = new PageAssembleFilter();

  callback: PageFilterCallback;

  filters;

  facetsFilter;

  backButtonFunc = undefined;

  constructor(
    private popCtrl: PopoverController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private telemetryService: TelemetryService,
    private platform: Platform,
    private frameworkService: FrameworkService,
    private translate: TranslateService,
    private appGlobalService: AppGlobalService
  ) {
    this.callback = navParams.get('callback');

    this.initFilterValues();

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  initFilterValues() {
    this.filters = this.navParams.get('filter');

    this.filters.forEach(filter => {
      if (filter.code === 'contentType') {
        let temp = [];
        filter.values.forEach(element => {
          temp.push(element.name);
        });
        filter.values = temp;
      }
    });


    let syllabus: Array<string> = this.appGlobalService.getCurrentUser().syllabus;
    let frameworkId = (syllabus && syllabus.length > 0) ? syllabus[0] : undefined;

    this.filters.forEach((element, index: number) => {
      this.getFrameworkData(frameworkId, element.code, index);

      //Framework API doesn't return domain and content Type exclude them
      if (index === this.filters.length - 1) this.facetsFilter = this.filters;
    });
  }

  /**
 * This will internally call framework API
 * @param {string} currentCategory - request Parameter passing to the framework API
 * @param {number} index - Local variable name to hold the list data
 */
  getFrameworkData(frameworkId: string, currentCategory: string, index: number): void {
    let req: CategoryRequest = {
      currentCategory: currentCategory,
      frameworkId: frameworkId
    };

    this.frameworkService.getCategoryData(req,
      (res: any) => {
        let responseArray = JSON.parse(res);
        if (responseArray && responseArray.length > 0) {
          this.filters[index].values = (currentCategory !== 'gradeLevel') ?
            _.map(responseArray, 'name').sort() : _.map(responseArray, 'name');
        }
      },
      (err: any) => {
        console.log("Subject Category Response: ", JSON.parse(err));
      });
  }

  openFilterOptions(facet) {
    let filterDialog = this.popCtrl.create(PageFilterOptions, { facets: facet }, {
      cssClass: 'resource-filter-options'
    });
    filterDialog.present();
  }

  getSelectedOptionCount(facet) {
    if (facet.selected && facet.selected.length > 0) {
      this.pagetAssemblefilter[facet.name] = facet.selected
      return `${facet.selected.length} ` + this.translateMessage('FILTER_ADDED');
    }

    return "";
  }

  apply() {
    if (this.callback) {
      this.callback.applyFilter(this.pagetAssemblefilter, this.facetsFilter);
    }
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.telemetryService.interact(
      generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.CANCEL,
        Environment.HOME,
        PageId.LIBRARY_PAGE_FILTER,
        null,
        undefined,
        undefined));
    this.viewCtrl.dismiss();
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );

    return translatedMsg;
  }
}

export interface PageFilterCallback {
  applyFilter(filter: PageAssembleFilter, appliedFilter: any);
}