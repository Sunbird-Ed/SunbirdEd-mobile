import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams } from "ionic-angular";
import { CourseFilterOptions } from "./options/filter.options";
import { PageAssembleFilter, TelemetryService, ImpressionType, PageId, Environment, InteractType, InteractSubtype } from "sunbird";
import { generateImpressionEvent, generateInteractEvent } from "../../../app/telemetryutil";

@Component({
  selector: 'page-course-filter',
  templateUrl: './course.filter.html'
})
export class CourseFilter {

  pagetAssemblefilter = new PageAssembleFilter();

  callback: CourseFilterCallback;

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


  constructor(private popCtrl: PopoverController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private telemetryService: TelemetryService) {
    this.callback = navParams.get('callback');
  }

  openFilterOptions(facet) {
    let filterDialog = this.popCtrl.create(CourseFilterOptions, { facets: facet }, {
      cssClass: 'course-filter-options'
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
        PageId.COURSE_PAGE_FILTER, null));
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.telemetryService.impression(generateImpressionEvent(
      ImpressionType.VIEW,
      PageId.COURSE_PAGE_FILTER,
      Environment.HOME, "", "", ""
    ));
  }
}

export interface CourseFilterCallback {
  applyFilter(filter: PageAssembleFilter);
}
