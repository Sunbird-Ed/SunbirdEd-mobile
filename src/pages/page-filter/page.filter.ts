import { Component } from "@angular/core";
import {
  PopoverController,
  ViewController,
  NavParams,
  Platform,
  Events
} from "ionic-angular";
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
  ImpressionType,
} from "sunbird";
import { PageFilterOptions } from "./options/filter.options";
import { generateInteractTelemetry } from "../../app/telemetryutil";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";

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
  selectedLanguage: string = 'en';

  constructor(
    private popCtrl: PopoverController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private telemetryService: TelemetryService,
    private platform: Platform,
    private frameworkService: FrameworkService,
    private translate: TranslateService,
    private appGlobalService: AppGlobalService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.callback = navParams.get('callback');
    this.initFilterValues();

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);

    this.events.subscribe('onAfterLanguageChange:update', (data) => {
      this.onLanguageChange();
    })
  }

  getTranslatedValues(translations) {
    if (translations.hasOwnProperty(this.translate.currentLang)) {
      return translations[this.translate.currentLang];
    }
    return "";
  }

  onLanguageChange() {
    if (this.filters) {
      this.filters.forEach(filter => {
        if (filter.code === 'contentType' && filter.hasOwnProperty('resourceTypeValues')) {
          let resourceTypes = [];
          filter.resourceTypeValues.forEach(element => {
            resourceTypes.push(this.getTranslatedValues(JSON.parse(element.translations) || element.name));
          });
          filter.values = resourceTypes;
          if (filter.hasOwnProperty('selected')) {
            let translatedSected = [];
            filter.selectedValuesIndices.forEach(selectedIndex => {
              translatedSected.push(filter.values[selectedIndex]);
            });
            filter.selected = translatedSected;
          }
        }
      });
    }
  }

  async initFilterValues() {
    this.filters = this.navParams.get('filter');
    let pageId = this.navParams.get('pageId');
    if (pageId === PageId.COURSES) {
      pageId = PageId.COURSE_PAGE_FILTER;
    } else if (pageId === PageId.LIBRARY) {
      pageId = PageId.LIBRARY_PAGE_FILTER;
    }
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      pageId,
      Environment.HOME
    );

    if (this.filters) {
      let filterNames = [];
      this.filters.forEach(element => {
        element.name = this.getTranslatedValues(JSON.parse(element.translations || element.name));
        filterNames.push(element.code);
      });

      let values = new Map();
      values["categories"] = filterNames;
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER,
        InteractSubtype.FILTER_CONFIG,
        Environment.HOME,
        pageId,
        undefined,
        values
      );
    }

    this.filters.forEach(filter => {
      if (filter.code === 'contentType' && !filter.hasOwnProperty('resourceTypeValues')) {
        filter.resourceTypeValues = _.cloneDeep(filter.values);
        let resourceTypes = [];
        filter.values.forEach(element => {
          resourceTypes.push(this.getTranslatedValues(JSON.parse(element.translations) || element.name));
        });
        filter.values = resourceTypes;
      }
    });

    let syllabus: Array<string> = this.appGlobalService.getCurrentUser().syllabus;
    let frameworkId = (syllabus && syllabus.length > 0) ? syllabus[0] : undefined;

    let index: number = 0;
    for (let element of this.filters) {
      try {
        await this.getFrameworkData(frameworkId, element.code, index);
      } catch (error) {
        console.log('error: ' + error);
      }
      //Framework API doesn't return domain and content Type exclude them
      if (index === this.filters.length - 1) {
        this.facetsFilter = this.filters;
      }
      index++;
    }
  }

  /**
 * This will internally call framework API
 * @param {string} currentCategory - request Parameter passing to the framework API
 * @param {number} index - Local variable name to hold the list data
 */
  async getFrameworkData(frameworkId: string, currentCategory: string, index: number) {
    return new Promise((resolve, reject) => {
      let req: CategoryRequest = {
        currentCategory: currentCategory,
        frameworkId: frameworkId,
        selectedLanguage: this.translate.currentLang
      };

      this.frameworkService.getCategoryData(req)
        .then(res => {
          let category = JSON.parse(res);
          // this.filters[index].name = category.name;  // Assign the lable from framework

          let responseArray = category.terms;
          if (responseArray && responseArray.length > 0) {
            resolve(this.filters[index].values = (currentCategory !== 'gradeLevel') ?
              _.map(responseArray, 'name').sort() : _.map(responseArray, 'name'));
          }
        })
        .catch(err => {
          // console.log("Category Response: ", JSON.parse(err));
          reject(err);
        });
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
      this.pagetAssemblefilter[facet.code] = facet.selected;
      return `${facet.selected.length} ` + this.translateMessage('FILTER_ADDED');
    }

    return "";
  }

  apply() {
    if (this.callback) {
      let filters = _.cloneDeep(this.facetsFilter);
      filters.forEach(element => {
        if (element.code === 'contentType' && element.selectedValuesIndices && element.selectedValuesIndices.length) {
          let resourceTypeSelectedValues = [];
          element.resourceTypeValues.forEach((item, index) => {
            if (element.selectedValuesIndices.includes(index)) {
              resourceTypeSelectedValues.push(item.code);
            }
          });
          this.pagetAssemblefilter[element.code] = resourceTypeSelectedValues;
        }
      });
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