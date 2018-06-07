import { Component } from "@angular/core";
import { NavParams, ViewController, Platform } from "ionic-angular";

@Component({
  selector: 'onboarding-alert',
  templateUrl: 'onboarding-alert.html'
})

export class OnboardingAlert {
  private callback: onBoardingSlidesCallback;

  selectedSlide: any;
  selectedOptions: any;
  index: number = 0;

  backButtonFunc = undefined;

  selectedSyllabus = '';

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private platform: Platform) {
    this.selectedSlide = this.navParams.get('facet');
    this.callback = this.navParams.get('callback');
    this.index = this.navParams.get('index');
    this.selectedOptions = [];
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);

    this.selectedSlide.options.forEach(element => {
      if (element.checked) {
        this.selectedSyllabus = element.value
      }
    });
  }

  onSyllabusSelect(selectedIndex: number) {
    //clear all the options selected before
    this.selectedSlide.options.forEach(element => {
      element.checked = false;
    });

    this.selectedSlide.options[selectedIndex].checked = true;
  }

  onSaveClick() {

    if (this.callback) {
      this.callback.save();
    }
    this.viewCtrl.dismiss();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
}

export interface onBoardingSlidesCallback {
  save(): any;
}