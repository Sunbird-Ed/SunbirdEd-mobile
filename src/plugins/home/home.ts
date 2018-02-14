import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TelemetryService } from '../../core/services/telemetry/telemetry.service';
import { Impression } from "../../core/services/telemetry/bean";
import { CoreModule } from '../../core/core.module';
import { BasePlugin, ContainerService } from '../../core';
import { ContentImport, ContentImportRequest } from '../../core/services/content/bean';
import { ContentService } from '../../core/services/content/content.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService,
    private telemetryService: TelemetryService, private contentService: ContentService) {

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
    this.telemetryService.sync();

    this.downloadContent();
  }

  downloadContent() {
    let contentImport = new ContentImport();

    contentImport.contentId = "do_2124373991497728001677"
    contentImport.destinationFolder = "/storage/emulated/0/Android/data/org.sunbird.app/files";

    let contentImportRequest = new ContentImportRequest();

    contentImportRequest.contentImportMap = {
      "do_2124373991497728001677": contentImport
    }

    console.log("Hello " + JSON.stringify(contentImportRequest));

    this.contentService.importContent(contentImportRequest, (response) => {
      console.log("Home : " + response);
    }, (error) => {
      console.log("Home : " + error);
    });


  }

}
