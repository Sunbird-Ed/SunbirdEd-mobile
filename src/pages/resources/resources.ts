import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria } from "sunbird";

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage {

  storyAndWorksheets: Array<any>;
  localResources: Array<any>;

  constructor(public navCtrl: NavController, 
    private pageService: PageAssembleService, 
    private ngZone: NgZone) {

  }

  ionViewWillEnter() {
    this.doRefresh();
  }

  doRefresh() {
    let that = this;
    let criteria = new PageAssembleCriteria();
    criteria.name = "Resource";
    this.pageService.getPageAssemble(criteria, res => {
      that.ngZone.run(() => {
        let response = JSON.parse(res);

        //TODO Temporary code - should be fixed at backend
        let a = JSON.parse(response.sections);
        let newSections = [];
        a.forEach(element => {
          element.display = JSON.parse(element.display);
          newSections.push(element);
        });
        //END OF TEMPORARY CODE

        that.storyAndWorksheets = newSections;
      });
    }, error => {

    });
  }

}
