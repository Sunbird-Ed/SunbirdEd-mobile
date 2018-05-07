import { platform } from 'os';
import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams, Platform } from "ionic-angular";
import { ResourceFilterOptions } from "./options/filter.options";
import { PageAssembleCriteria, PageAssembleFilter, TelemetryService, InteractType, InteractSubtype, Environment, PageId } from "sunbird";
import { generateInteractEvent } from "../../../app/telemetryutil";

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
      values: ["NCERT",
        "CBSE",
        "ICSE",
        "UP Board",
        "AP Board",
        "TN Board",
        "NCTE",
        "MSCERT",
        "BSER",
        "Others"]
    },
    {
      name: "gradeLevel",
      displayName: "Grade",
      values: ["Kindergarten",
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10",
        "Grade 11",
        "Grade 12",
        "Other"]
    },
    {
      name: "domain",
      displayName: "Domain",
      values: ["numeracy",
        "literacy",
        "science"]

    },
    {
      name: "contentType",
      displayName: "Content Type",
      values: ["Story",
        "Worksheet",
        "Collection",
        "LessonPlan",
        "TextBook"]

    },
    {
      name: "subject",
      displayName: "Subject",
      values: ["Maths",
        "English",
        "Hindi",
        "Assamese",
        "Bengali",
        "Gujarati",
        "Kannada",
        "Malayalam",
        "Marathi",
        "Nepali",
        "Odia",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Urdu",
        "Other",]

    },
    {
      name: "medium",
      displayName: "Medium",
      values: ["English",
        "Hindi",
        "Assamese",
        "Bengali",
        "Gujarati",
        "Kannada",
        "Malayalam",
        "Marathi",
        "Nepali",
        "Odia",
        "Punjabi",
        "Tamil",
        "Telugu",
        "Urdu",
        "Other"]

    }];

  facetsFilter;

  backButtonFunc = undefined;

  constructor(private popCtrl: PopoverController, private viewCtrl: ViewController, navParams: NavParams,private telemetryService: TelemetryService, private platform: Platform) {
    this.callback = navParams.get('callback');

    if (navParams.get('filter')) {
      this.facetsFilter = navParams.get('filter');
    } else {
      this.facetsFilter = this.FILTERS;
    }

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
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
      return facet.selected.length + " added";
    } else {
      return "";
    }
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
      PageId.LIBRARY_PAGE_FILTER,null));
    this.viewCtrl.dismiss();
  }
}

export interface ResourceFilterCallback {
  applyFilter(filter: PageAssembleFilter, appliedFilter: any);
}
