
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnnouncementService, AttachmentService, TelemetryService } from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';

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
     * Contains the announcement id
     */
    public announcementId: string;

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
    /**
     *
     * @param navCtrl
     * @param navParams
     * @param contentService
     */
    constructor(navCtrl: NavController, private socialSharing: SocialSharing,
        navParams: NavParams, announcementService: AnnouncementService,
        attachmentService: AttachmentService, file: File,
        zone: NgZone) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.announcementService = announcementService;
        this.attachmentService = attachmentService;
        this.file = file;
        this.zone = zone;
        console.log('Course identifier ===> ', this.navParams.get('identifier'));
        this.announcementId = this.navParams.get('id');
        console.log(this.announcementId);
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
        let attachmentPath: string = this.file.externalRootDirectory + '/Announcements/' + announcementDetail.id+ '/'+ announcementDetail.attachments[0].name;
        console.log(attachmentPath);
        this.socialSharing.share(message, null, attachmentPath, "Links: " + announcementDetail.links.toString()).then(() => {
            console.log('inside .then function');
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
   *  Returns the Object with given Keys only
   * @param {string} keys - Keys of the object which are required in new sub object
   * @param {object} obj - Actual object
   * @returns {object}
   */
  getSubset(keys, obj) {
    return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
  }

  openLink(url: string): void {
    let options = 'hardwareback=yes,clearcache=no,zoom=no,toolbar=yes,clearsessioncache=no,closebuttoncaption=Done,disallowoverscroll=yes';
    (<any>window).cordova.InAppBrowser.open(url, '_system', options);
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
        let announcementPath = this.file.externalRootDirectory + 'Announcements';
        let attachmentPath = this.file.externalRootDirectory + '/Announcements/' + this.announcementId + '/';

        //Check if the  announcement directory exists
        this.file.checkDir(this.file.externalRootDirectory, 'Announcements').then(
            (found) => {
                if (found) {
                    console.log("Found Announcement directory")
                    this.checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName);
                }
            }
        ).catch(
            (err) => {
                console.log("Announcement directory not found ")
                this.file.createDir(this.file.externalRootDirectory, 'Announcements', true).then(
                    (value) => {
                        console.log("Announcement Directory created path - " + value);

                        this.checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName);
                    }
                ).catch(
                    (err) => {
                        console.log("Error in creating  Announcements directory - " + err);
                    }
                );
            }
        );
    }

    /**
     * This method checks if the announcement id directory already exists, if not, it will create one
     *
     * @param url
     * @param announcementPath
     * @param attachmentPath
     * @param attachmentFileName
     */
    checkAnnouncementIdDirectory(url, announcementPath, attachmentPath, attachmentFileName) {
        //Check if the  announcement id directory exists
        this.file.checkDir(announcementPath, this.announcementId).then(
            (found) => {
                if (found) {
                    console.log("Found Announcement ID directory")
                    this.downloadAndSaveFile(url, attachmentPath, attachmentFileName);
                }
            }
        ).catch(
            (err) => {
                console.log("Announcement ID directory not found ")
                this.file.createDir(announcementPath, this.announcementId, true).then(
                    (value) => {
                        console.log("Announcement ID Directory created path - " + value);

                        this.downloadAndSaveFile(url, attachmentPath, attachmentFileName);

                    }
                ).catch(
                    (err) => {
                        console.log("Error in creating Announcement ID directory - " + err);
                    });
            }
        );
    }

    /**
     * This method downloads and saves a file to the specified directory
     *
     * @param url
     * @param attachmentPath
     * @param attachmentFileName
     */
    downloadAndSaveFile(url, attachmentPath, attachmentFileName) {
        //check if the attachment is already downloaded and stored locally
        this.file.checkFile(attachmentPath, attachmentFileName).then(
            (found) => {
                if (found) {
                    console.log("files found " + found)
                    let path: string = attachmentPath + attachmentFileName;
                    this.attachmentService.checkExtensionAndOpenFile(path);
                } else {
                    this.attachmentService.downloadAttachment(url, attachmentPath + attachmentFileName);

                    // this.attachmentService.listenDownloadProgress((event) => {
                    //     console.log("Attachment download progress - " + "Total - " + event.total + "Loaded - " + event.loaded);
                    // })
                }
            }
        ).catch(
            (err) => {
                console.log("files not found ")
                this.attachmentService.downloadAttachment(url, attachmentPath + attachmentFileName);

                // this.attachmentService.listenDownloadProgress((event) => {
                //     console.log("Attachment download progress - " + "Total - " + event.total + "Loaded - " + event.loaded);
                // })
            }
        );
    }
}

