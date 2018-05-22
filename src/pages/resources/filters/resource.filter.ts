import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams, Platform } from "ionic-angular";
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
  FrameworkService
} from "sunbird";
import { ResourceFilterOptions } from "./options/filter.options";
import { generateInteractEvent } from "../../../app/telemetryutil";
import * as frameworkDataList from "../../../config/framework.filters";

@Component({
  selector: 'page-resource-filter',
  templateUrl: './resource.filter.html'
})
export class ResourceFilter {
  pagetAssemblefilter = new PageAssembleFilter();

  callback: ResourceFilterCallback;

  FILTERS = [
    {
      name: "board",
      displayName: "Board",
      values: frameworkDataList.boardList.sort()
    },
    {
      name: "gradeLevel",
      displayName: "Grade",
      values: frameworkDataList.gradeList.sort()
    },
    {
      name: "subject",
      displayName: "Subject",
      values: frameworkDataList.subjectList.sort()

    },
    {
      name: "medium",
      displayName: "Medium",
      values: frameworkDataList.mediumList.sort()

    },
    {
      name: "contentType",
      displayName: "Resource Type",
      values: frameworkDataList.contentTypeList.sort()
    }];

  facetsFilter;

  backButtonFunc = undefined;

  constructor(
    private popCtrl: PopoverController,
    private viewCtrl: ViewController,
    navParams: NavParams,
    private telemetryService: TelemetryService,
    private platform: Platform,
    private frameworkService: FrameworkService,
    private translate: TranslateService
  ) {
    this.callback = navParams.get('callback');

    if (navParams.get('filter')) {
      this.facetsFilter = navParams.get('filter');
    } else {
      this.FILTERS.forEach((element, index: number) => {
        if(index < 4) this.getFrameworkData(element.name, index);

        //Framework API doesn't return domain and content Type exclude them
        if(index === this.FILTERS.length - 1) this.facetsFilter = this.FILTERS;
      });
    }

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  /**
 * This will internally call framework API
 * @param {string} currentCategory - request Parameter passing to the framework API
 * @param {number} index - Local variable name to hold the list data
 */
  getFrameworkData(currentCategory: string, index: number): void {
    let req: CategoryRequest = {
      currentCategory: currentCategory
    };

    this.frameworkService.getCategoryData(req,
      (res: any) => {
        this.FILTERS[index].values = (currentCategory !== 'gradeLevel') ? _.map(JSON.parse(res), 'name').sort() : _.map(JSON.parse(res), 'name');
        console.log(currentCategory + " Category Response: " + this.FILTERS[index]);
      },
      (err: any) => {
        console.log("Subject Category Response: ", JSON.parse(err));
      });
  }

  openFilterOptions(facet) {
    let filterDialog = this.popCtrl.create(ResourceFilterOptions, { facets: facet }, {
      cssClass: 'resource-filter-options'
    });
    filterDialog.present();
  }

  getSelectedOptionCount(facet) {
    if (facet.selected && facet.selected.length > 0) {
      this.pagetAssemblefilter[facet.name] = facet.selected
      return `${facet.selected.length} ` + this.translateMessage('ADDED');
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
      generateInteractEvent(InteractType.TOUCH,
        InteractSubtype.CANCEL,
        Environment.HOME,
        PageId.LIBRARY_PAGE_FILTER, null));
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

export interface ResourceFilterCallback {
  applyFilter(filter: PageAssembleFilter, appliedFilter: any);
}
