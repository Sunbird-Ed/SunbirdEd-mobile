import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { TelemetryService, 
  Impression, 
  FrameworkModule, 
  BasePlugin, 
  ContainerService, 
  ContentImport, 
  ContentImportRequest,
  ContentService
} from '../../../framework';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService,
    private telemetryService: TelemetryService, private contentService: ContentService, private events: Events) {

    this.events.subscribe('genie.event', (response) => {
      console.log("Result " + response);
    });

  }

  init(container: ContainerService) {

    container.addTab({root: HomePage, label: "HOME", icon:"home"});
  }

  ionViewDidLoad() {
    let impression = new Impression();
    impression.type = "view";
    impression.pageId = "ionic_sunbird";
    this.telemetryService.impression(impression);
  }

  onSyncClick() {
    this.telemetryService.sync((response) => {
      console.log("Telemetry Home : " + response);
    }, (error) => {
      console.log("Telemetry Home : " + error);
    });

    this.downloadContent();
  }

  downloadContent() {
    let contentImport = new ContentImport();

    contentImport.contentId = "do_2123823398249594881455"
    contentImport.destinationFolder = "/storage/emulated/0/Android/data/org.sunbird.app/files";

    let contentImportRequest = new ContentImportRequest();

    contentImportRequest.contentImportMap = {
      "do_2123823398249594881455": contentImport
    }

    console.log("Hello " + JSON.stringify(contentImportRequest));

    this.contentService.importContent(contentImportRequest, (response) => {
      console.log("Home : " + response);
    }, (error) => {
      console.log("Home : " + error);
    });


  }

}
