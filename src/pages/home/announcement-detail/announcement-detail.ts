
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, Events, Alert } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AnnouncementService, AttachmentService } from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
    TelemetryService,
    FrameworkModule
} from 'sunbird';
@Component({
    selector: 'announcement-detail',
    templateUrl: 'announcement-detail.html',
    providers: [TelemetryService, AnnouncementService, AttachmentService]
})
/**
 * Generated class for the AnnouncementDetailComponent component.
 *
 */
export class AnnouncementDetailComponent implements OnInit {
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
     * Contains reference of Attachment service
     */
    public attachmentService: AttachmentService;

    /**
     * Contains reference of File
     */
    public file: File;


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
    constructor(navCtrl: NavController, private socialSharing: SocialSharing,
        navParams: NavParams, announcementService: AnnouncementService,
        zone: NgZone, private events: Events, attachmentService: AttachmentService, file: File) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.announcementService = announcementService;
        this.attachmentService = attachmentService;
        this.file = file;
        this.zone = zone;
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

    /**
     * Method to download attachment 
     * 
     * 
     * @param attachmentsLink 
     */
    downloadattachment(attachmentsLink) {
        let url = attachmentsLink;
        let fileUrl = url.split("/");
        let attachmentFileName = fileUrl[fileUrl.length - 1];

        //check if the attachment is already downloaded and stored locally
        this.file.checkFile(this.file.externalRootDirectory, attachmentFileName).then(
            (found) => {
                if (found) {
                    console.log("files found " + found)
                    let path: string = this.file.externalRootDirectory + attachmentFileName;
                    this.attachmentService.checkExtensionAndOpenFile(path);
                } else {
                    this.attachmentService.downloadAttachment(url, this.file.externalRootDirectory + attachmentFileName);
                }
            }
        ).catch(
            (err) => {
                console.log("files not found ")
                this.attachmentService.downloadAttachment(url, this.file.externalRootDirectory + attachmentFileName);
            }
        );
    }
}

