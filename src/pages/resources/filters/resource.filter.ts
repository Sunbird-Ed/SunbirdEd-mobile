import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams } from "ionic-angular";
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

  facetsFilter = [
    {
      name: "language",
      displayName: "Language",
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
        "Sanskrit",
        "Maithili",
        "Munda",
        "Santali",
        "Juang",
        "Ho",
        "Other"]

    },
    {
      name: "grade",
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
      name: "Concepts",
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
      name: "ageGroup",
      displayName: "Age Group",
      values: ["<5",
        "5-6",
        "6-7",
        "7-8",
        "8-10",
        ">10",
        "Other"

      ]
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

    },
    {
      name: "ownership",
      displayName: "Ownership",
      values: ["current user",
        "all"]

    },
    {
      name: "status",
      displayName: "Status",
      values: ["Live"]

    }];


  constructor(private popCtrl: PopoverController, private viewCtrl: ViewController, navParams: NavParams,private telemetryService: TelemetryService) {
    this.callback = navParams.get('callback');
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
      this.callback.applyFilter(this.pagetAssemblefilter);
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
  applyFilter(filter: PageAssembleFilter);
}
