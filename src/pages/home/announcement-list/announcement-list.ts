import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AnnouncementService, AuthService } from 'sunbird';
import { DocumentDirection } from 'ionic-angular/platform/platform';
import {
    TelemetryService,
    Impression,
    ContentImport,
    ContentImportRequest,
    ContentService
} from 'sunbird';
@Component({
    selector: 'announcement-list',
    templateUrl: 'announcement-list.html',
    providers: [TelemetryService, AnnouncementService]

})
export class AnnouncementListComponent  {
    /**
     * Contains announcement list
     */
    announcementList: Array<any> = [];
    /**
     * Contains user id
     */
    userId: string;
    limit: number;
    /**
     * Flag to show/hide loader
     */
    showLoader: boolean;
    /**
     * Http service to make api call
     */
    public http: HttpClient;
    /**
     * Announcement service to get announcement list
     */
    public announcementService: AnnouncementService;
    /**
     * Auth service to get user id
     */
    public authService: AuthService;

    currentStyle = "ltr";

    enableInfiniteScroll: boolean = false;
    apiOffset = 0;
    apiLimit = 10;
    constructor(public navCtrl: NavController, http: HttpClient, announcementService: AnnouncementService, authService: AuthService,
        private telemetryService: TelemetryService, private contentService: ContentService, private events: Events, public platform: Platform, private ngZone: NgZone) {
        this.http = http;
        this.announcementService = announcementService;
        this.authService = authService;
        this.userId = '659b011a-06ec-4107-84ad-955e16b0a48a';
        this.events.subscribe('genie.event', (response) => {
            console.log("Result " + response);
        });
    }
    /**
     * To get Announcement List  of logged-in user.
     *
     * It internally calls Announcement List handler of genie sdk
     */
    getAnnouncementList(scrollEvent = undefined): void {
        console.log('making api call to Announcement list');

        let option = {
            offset: this.apiOffset,
            limit: this.apiLimit,
        };
        this.announcementService.getAnnouncementList(option, (data: any) => {
            if (data) {
                data = JSON.parse(data);
                console.log(data);
                this.ngZone.run(() => {
                    this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < data.count ? true : false;
                    if (scrollEvent) scrollEvent.complete();
                    console.log("Data.announce", data.announcements);
                    Array.prototype.push.apply(this.announcementList, data.announcements);
                    this.announcementList.forEach(announcement => {
                        announcement.attachments.forEach(element => {
                            element.mimetype = element.mimetype.split('/');
                            element.mimetype = element.mimetype[element.mimetype.length - 1];
                        });
                    });
                    console.log('this announcement list', this.announcementList);
                    this.spinner(false);
                })
            }
        }, (error: any) => {          
            console.log('error while loading  Announcement list', error);
            this.spinner(false);
        });
    }
    /**
      * To start and stop loader
      */
    spinner(flag: boolean) {
        this.showLoader = flag;
    }
    /**
     * Angular life cycle hooks
     */
    ionViewWillEnter() {
        console.log('ng oninit component initialized...');
        this.spinner(true);
        this.getAnnouncementList();
    }
    changeLanguage(event) {

        if (this.currentStyle === "ltr") {
            this.currentStyle = "rtl";
        } else {
            this.currentStyle = "ltr";
        }
        this.platform.setDir(this.currentStyle as DocumentDirection, true);
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
    doInfiniteScroll(scrollEvent) {
        if (this.enableInfiniteScroll) {
            this.apiOffset += this.apiLimit;
            this.getAnnouncementList(scrollEvent);
        } else {
            scrollEvent.complete();
        }
    }
}
