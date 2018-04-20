import { Component } from "@angular/core";
import { PopoverController, ViewController, NavParams } from "ionic-angular";
import { CourseFilterOptions } from "./options/filter.options";
import { PageAssembleFilter } from "sunbird";

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


    constructor(private popCtrl: PopoverController, private viewCtrl: ViewController, navParams: NavParams) {
      this.callback = navParams.get('callback');
    }

    openFilterOptions(facet) {
      let filterDialog = this.popCtrl.create(CourseFilterOptions, {facets: facet}, {
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
      this.viewCtrl.dismiss();
    }
}

export interface CourseFilterCallback {
  applyFilter(filter: PageAssembleFilter);
}
