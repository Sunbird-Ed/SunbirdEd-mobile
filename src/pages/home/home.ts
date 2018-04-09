import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import {
  TelemetryService,
  Impression,
  FrameworkModule,
  ContentImport,
  ContentImportRequest,
  ContentService,
  UserProfileService,
  TenantInfoRequest
} from 'sunbird';

const KEY_SUNBIRD_SUPPORT_FILE_PATH = "sunbird_support_file_path";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage {

  logo: string = "assets/imgs/ic_logo.png";

  constructor(public navCtrl: NavController,
    private telemetryService: TelemetryService,
    private contentService: ContentService,
    private events: Events,
    private ngZone: NgZone,
    private userProfileService: UserProfileService,
    private storage: Storage) {

    this.events.subscribe('genie.event', (response) => {
      console.log("Result " + response);
    });

  }

  ionViewDidLoad() {
    // let impression = new Impression();
    // impression.type = "view";
    // impression.pageId = "ionic_sunbird";
    // this.telemetryService.impression(impression);
    this.refreshTenantData();
    (<any>window).supportfile.makeEntryInSunbirdSupportFile((result) => {
      console.log("Result - " + JSON.parse(result));
      this.storage.set(KEY_SUNBIRD_SUPPORT_FILE_PATH, JSON.parse(result));
    }, (error) => {
      console.log("Error - " + error);
    });
  }

  refreshTenantData() {
    let request = new TenantInfoRequest();
    request.refreshTenantInfo = true;
    request.slug = "sunbird";
    this.userProfileService.getTenantInfo(
      request,
      res => {
        this.ngZone.run(() => {
          let r = JSON.parse(res);
          this.logo = r["logo"];
        });
      },
      error => {

      }
    );
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
