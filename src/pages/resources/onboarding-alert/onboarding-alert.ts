import { Component } from "@angular/core";
import { NavParams, ViewController, PopoverController, Popover } from "ionic-angular";
import { ResourcesPage} from "../resources";


@Component({
  selector: 'page-filter-option',
  templateUrl: 'onboarding-alert.html'
})

export class FilterOptions {
  private callback: onBoardingSlidesCallback;

  selectedSlide: any;
  selectedOptions: any;
  index: number = 0;

  constructor(private navParams: NavParams, private popCtrl:PopoverController, private viewCtrl: ViewController) {
    this.selectedSlide = this.navParams.get('facet');
    this.callback = this.navParams.get('callback');
    this.index = this.navParams.get('index');
    this.selectedOptions= [];
  }

  onSaveClick(){

    if (this.callback) {
      this.callback.save();
    }
    this.viewCtrl.dismiss();
  }
  cancel(){
    this.viewCtrl.dismiss();
  }
}

export interface onBoardingSlidesCallback {
  save(): any;
}