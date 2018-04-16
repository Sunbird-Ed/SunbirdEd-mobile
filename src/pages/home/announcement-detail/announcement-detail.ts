
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, Events, Alert } from 'ionic-angular';
import { AnnouncementService } from 'sunbird';
import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import {
    TelemetryService,
    FrameworkModule
} from 'sunbird';
@Component({
    selector: 'announcement-detail',
    templateUrl: 'announcement-detail.html',
    providers: [TelemetryService, AnnouncementService]
})
/**
 * Generated class for the AnnouncementDetailComponent component.
 *
 */
export class AnnouncementDetailComponent implements OnInit {
    public fileTransfer: FileTransferObject;
    /**
     * Contains announcemet  details
     */
    announcementDetail: any;
    showChildrenLoader: boolean;

    /**
     * Contains reference of Anoouncement service service
     */
    public announcementService: AnnouncementService;

    /**
     * Contains ref of navigation controller 
     */
    public navCtrl: NavController;

    /**
     * Contains ref of navigation params
     */
    public navParams: NavParams;

    /**
     * Contains reference of zone service
     */
    public zone: NgZone;
    id: string;
    /**
     * 
     * @param navCtrl 
     * @param navParams 
     * @param contentService 
     */
    constructor(navCtrl: NavController, private socialSharing: SocialSharing, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener, navParams: NavParams, announcementService: AnnouncementService, zone: NgZone, private http: HttpClient,
        private events: Events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.announcementService = announcementService;
        this.zone = zone;
        this.fileTransfer = this.transfer.create();
        console.log('Course identifier ===> ', this.navParams.get('identifier'));
        this.id = this.navParams.get('id');
        console.log(this.id);
    }
    /** 
     * To get Announcement  details.
     */
    getAnnouncementDetails() {
        let req = {
            announcementId: this.navParams.get('id')
        }

        console.log('Making api call to get Announcement details');
        this.announcementService.getAnnouncementDetails(req, (data: any) => {
            this.zone.run(() => {
                data = JSON.parse(data);
                console.log('Announcemet details response ==>', data);
                this.announcementDetail = data ? data : [];
            });
        },
            error => {
                console.log('error while loading content details', error);
            });
    }
    /**
     * Angular life cycle hooks
     */
    ngOnInit() {
        this.getAnnouncementDetails();
    }
    /**
     * SocialSharing
     */
    share(announcementDetail) {
        let message: string = ` Type: ${announcementDetail.type}\nDescription: ${announcementDetail.description}\nTitle: ${announcementDetail.title}\n`;
        this.socialSharing.share(message, null, null, "Links: " + announcementDetail.links.toString()).then(() => {
            console.log('inside .then function');
        }).catch((error) => {
            console.log(error);
        });
    }
    downloadattachment(attachmentsLink) {
        let url = attachmentsLink;
        let fileUrl = url.split("/");
        let myFile = fileUrl[fileUrl.length - 1];
        this.fileTransfer.download(url, this.file.externalRootDirectory + myFile).then((entry) => {
            // this.fileOpener.open('/storage/emulated/file.pdf', 'application/pdf')
            //     .then(() => console.log('File is opened'))
            //     .catch(e => console.log('Error opening file', e));
            console.log(entry);
            console.log('download complete: ' + entry.toURL());
        }, (error) => {
            console.log('download Incomplete: ', error);
        });
    }
}

