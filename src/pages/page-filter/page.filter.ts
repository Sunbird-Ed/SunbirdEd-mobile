import {Component, Inject} from '@angular/core';
import {Events, NavParams, Platform, PopoverController, ViewController} from 'ionic-angular';
import {AppGlobalService} from '../../service/app-global.service';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {PageFilterOptions} from './options/filter.options';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {CommonUtilService} from '../../service/common-util.service';
import {FormAndFrameworkUtilService} from '../profile';
import {
  CategoryTerm,
  FrameworkCategoryCode,
  FrameworkCategoryCodesGroup,
  FrameworkUtilService,
  GetFrameworkCategoryTermsRequest,
  PageAssembleFilter
} from 'sunbird-sdk';
import {Environment, ImpressionType, InteractSubtype, InteractType, PageId} from '../../service/telemetry-constants';

@Component({
  selector: 'page-filter',
  templateUrl: './page.filter.html'
})
export class PageFilter {
  pagetAssemblefilter: PageAssembleFilter = {};

  callback: PageFilterCallback;

  filters;
  pageId;
  facetsFilter;

  backButtonFunc = undefined;
  selectedLanguage = 'en';
  categories: Array<FrameworkCategoryCode> = FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES;

  constructor(
    private popCtrl: PopoverController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private platform: Platform,
    private translate: TranslateService,
    private appGlobalService: AppGlobalService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService
  ) {
    this.callback = navParams.get('callback');
    this.initFilterValues();

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc = undefined;
    }, 10);

    this.events.subscribe('onAfterLanguageChange:update', () => {
      this.onLanguageChange();
    });
  }

  onLanguageChange() {
    if (this.filters) {
      this.filters.forEach(filter => {
        if (filter.code === 'contentType' && filter.hasOwnProperty('resourceTypeValues')) {
          const resourceTypes = [];
          filter.resourceTypeValues.forEach(element => {
            resourceTypes.push(this.commonUtilService.getTranslatedValue(element.translations, element.name));
          });
          filter.values = resourceTypes;
          if (filter.hasOwnProperty('selected')) {
            const translatedSected = [];
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
    this.pageId = this.navParams.get('pageId');
    const loader = this.commonUtilService.getLoader();
    loader.present();
    if (this.pageId === PageId.COURSES) {
      this.pageId = PageId.COURSE_PAGE_FILTER;
      this.categories = FrameworkCategoryCodesGroup.COURSE_FRAMEWORK_CATEGORIES;
    } else if (this.pageId === PageId.LIBRARY) {
      this.pageId = PageId.LIBRARY_PAGE_FILTER;
    }
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      this.pageId,
      Environment.HOME
    );

    if (this.filters) {
      const filterNames = [];
      this.filters.forEach(element => {
        element.name = this.commonUtilService.getTranslatedValue(element.translations, element.name);
        filterNames.push(element.code);
      });

      const values = new Map();
      values['categories'] = filterNames;
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER,
        InteractSubtype.FILTER_CONFIG,
        Environment.HOME,
        this.pageId,
        undefined,
        values
      );
    }

    this.filters.forEach(filter => {
      if (filter.code === 'contentType' && !filter.hasOwnProperty('resourceTypeValues')) {
        filter.resourceTypeValues = _.cloneDeep(filter.values);
        const resourceTypes = [];
        filter.values.forEach(element => {
          resourceTypes.push(this.commonUtilService.getTranslatedValue(element.translations, element.name));
        });
        filter.values = resourceTypes;
      }
    });

    const syllabus: Array<string> = this.appGlobalService.getCurrentUser().syllabus;
    let frameworkId;

    if (this.pageId === PageId.COURSE_PAGE_FILTER) {
      frameworkId = await this.formAndFrameworkUtilService.getCourseFrameworkId();
    } else {
      frameworkId = (syllabus && syllabus.length > 0) ? syllabus[0] : undefined;
    }
    let index = 0;
    for (const element of this.filters) {
      try {
        if (!element.frameworkCategory && this.pageId === PageId.COURSE_PAGE_FILTER) {
          await this.getRootOrganizations(index);
        } else {
          await this.getFrameworkData(frameworkId, element.code, index);
        }
      } catch (error) {
        console.log('error: ' + error);
      }
      // Framework API doesn't return domain and content Type exclude them
      if (index === this.filters.length - 1) {
        this.facetsFilter = this.filters;
        loader.dismiss();
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
      const req: GetFrameworkCategoryTermsRequest = {
        currentCategoryCode: currentCategory,
        language: this.translate.currentLang,
        requiredCategories: this.categories,
        frameworkId: frameworkId
      };
      this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
        .then((res: CategoryTerm[]) => {
          const category = res;
          // this.filters[index].name = category.name;  // Assign the lable from framework

          const responseArray = category;
          if (responseArray && responseArray.length > 0) {
            if (req.currentCategoryCode === 'topic' && this.pageId === PageId.COURSE_PAGE_FILTER) {
              // this.filters[index].values = _.map(responseArray, 'name');
              for (let i = 0; i < responseArray.length; i++) {
                const name = responseArray[i].name;
                this.filters[index].values[i] = {};
                // this.filters[index].values[i][name] = _.map(responseArray[i].children, 'name');
                this.filters[index].values[i][name] = responseArray[i].children;
              }
              resolve();
            } else {
              resolve(this.filters[index].values = _.map(responseArray, 'name'));
            }
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  openFilterOptions(facet) {
    const filterDialog = this.popCtrl.create(PageFilterOptions, { facets: facet }, {
      cssClass: 'resource-filter-options'
    });
    filterDialog.present();
  }

  getSelectedOptionCount(facet) {
    if (facet.selected && facet.selected.length > 0) {
      this.pagetAssemblefilter[facet.code] = facet.selected;
      return `${facet.selected.length} ` + this.commonUtilService.translateMessage('FILTER_ADDED');
    }

    return '';
  }

  apply() {
    if (this.callback) {
      const filters = _.cloneDeep(this.facetsFilter);
      filters.forEach(element => {
        if (element.code === 'contentType' && element.selectedValuesIndices && element.selectedValuesIndices.length) {
          const resourceTypeSelectedValues = [];
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
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CANCEL,
      Environment.HOME,
      this.pageId);
    this.viewCtrl.dismiss();
  }

  getRootOrganizations(index) {
    this.formAndFrameworkUtilService.getRootOrganizations()
      .then(res => {
        this.filters[index].values = res;
      })
      .catch(error => {
        console.log(error, 'index', index);
      });
  }

  ionViewWillLeave(): void {
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
  }
}


export interface PageFilterCallback {
  applyFilter(filter: PageAssembleFilter, appliedFilter: any);
}
