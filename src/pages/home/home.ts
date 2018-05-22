import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Events, Platform, ToastController } from 'ionic-angular';
import { DocumentDirection } from 'ionic-angular/platform/platform';
// import { Storage } from "@ionic/storage";

import {
  CourseService,
  AnnouncementService,
  AuthService,
  TelemetryService,
  ContentImport,
  ContentImportRequest,
  ContentService,
  UserProfileService,
  TenantInfoRequest,
  PageId,
  ContentDetailRequest,
  UserProfileDetailsRequest
} from 'sunbird';
import { AnnouncementListComponent } from './announcement-list/announcement-list'
import { SunbirdQRScanner, QRResultCallback } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { FormEducation } from "../profile/education/form.education";
import { FormAddress } from "../profile/address/form.address";
import { FormExperience } from "../profile/experience/form.experience"
import { AdditionalInfoComponent } from "../profile/additional-info/additional-info";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService, AnnouncementService]

})
export class HomePage implements OnInit {

  /**
   * Contains enrolled course
   */
  enrolledCourse: Array<any>;
  /**
   * Contains announcement list
   */
  announcementList: Array<any> = [];

  /**
   * Contains user id
   */
  userId: string;

  /**
   * Flag to show/hide loader
   */
  showLoader: boolean;

  currentStyle = "ltr";

  /**
   * Contains Profile Object
   */
  profile: any = {};

  uncompletedDetails: any = {
    title: ""
  };


  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl Reference of nav controller to navigate user from one page to another
   * @param {HttpClient} http Reference of http client service to make api call
   */

  logo: string = "assets/imgs/ic_logo.png";

  constructor(public navCtrl: NavController,
    private courseService: CourseService,
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private telemetryService: TelemetryService,
    private contentService: ContentService,
    private events: Events,
    public platform: Platform,
    private ngZone: NgZone,
    private userProfileService: UserProfileService,
    private qrScanner: SunbirdQRScanner,
    private toastCtrl: ToastController
    // private storage: Storage
  ) {
    this.getUserId();
    // // TODO: remove this hardcodec id before pushing the code
    // this.userId = '659b011a-06ec-4107-84ad-955e16b0a48a';
    this.events.subscribe('genie.event', (response) => {
      console.log("Result " + response);
    });
  }
  /**
   *Navigate to all announcemet list
   */
  navigateToAnnouncementListPage(): void {
    this.navCtrl.push(AnnouncementListComponent);
  }

  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(): void {
    let option = {
      userId: this.userId,
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.ngZone.run(() => {
          this.enrolledCourse = data.result.courses ? data.result.courses : [];
          this.spinner(false);
        })
      }
    }, (error: any) => {
      console.log('error while loading enrolled courses', error);
      this.spinner(false);
    });
  }

  /**
   * To get Announcement List  of logged-in user.
   *
   * It internally calls Announcement List handler of genie sdk
   */
  getAnnouncementList(): void {
    console.log('making api call to Announcement list');
    let option = {
      limit: 2,
      offset: 1
    };
    this.announcementService.getAnnouncementList(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        console.log(data);
        this.ngZone.run(() => {
          console.log('this announcement list', this.announcementList);
          Array.prototype.push.apply(this.announcementList, data.announcements);
          this.announcementList.forEach(announcement => {
            announcement.attachments.forEach(element => {
              element.mimetype = element.mimetype.split('/');
              element.mimetype = element.mimetype[element.mimetype.length - 1];
            });
          });
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
  ngOnInit() {
    console.log('ng oninit component initialized...');
    this.spinner(true);
    this.getUserId();
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
    this.refreshTenantData();
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

  search() {
    const contentType: Array<string> = [
      "Story",
      "Worksheet",
      "Game",
      "Collection",
      "TextBook",
      "Course",
      "LessonPlan",
      "Resource",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType, source: PageId.HOME })
  }

  /**
  * Get user id.
  *
  * Used to get enrolled course(s) of logged-in user
  */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.log('session expired')
      } else {
        this.getProfileCompletionDetails(session)
      }
    });
  }

  getProfileCompletionDetails(session: any) {
    let sessionObj = JSON.parse(session);
    this.userId = sessionObj["userToken"];

    let req: UserProfileDetailsRequest = {
      userId:
        this.userId && this.userId != sessionObj["userToken"]
          ? this.userId
          : sessionObj["userToken"],
      requiredFields: [
        "completeness",
        "missingFields",
        "lastLoginTime",
        "topics"
      ],
      refreshUserProfileDetails: true
    };

    this.userProfileService.getUserProfileDetails(
      req,
      (res: any) => {
        this.ngZone.run(() => {
          let r = JSON.parse(res);
          this.profile = r.response;
          this.formatMissingFields();
          this.getEnrolledCourses();
        });
      },
      (error: any) => {
        console.error(error);
        this.getEnrolledCourses();
      }
    );
  }

  /**
   * To Format the missing fields and gives it proper name based on missing field
   * TODO: Need to replace following strings with the language constants
   */
  formatMissingFields() {
    this.uncompletedDetails.title = '';
    if (this.profile.missingFields && this.profile.missingFields.length) {
      switch (this.profile.missingFields[0]) {
        case "education":
          this.uncompletedDetails.title = "+ Add Education";
          this.uncompletedDetails.page = FormEducation;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          }
          break;
        case "jobProfile":
          this.uncompletedDetails.title = "+ Add Experience";
          this.uncompletedDetails.page = FormExperience;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          }
          break;
        case "avatar":
          this.uncompletedDetails.title = "+ Add Avatar";
          this.uncompletedDetails.page = "picture";
          break;
        case "address":
          this.uncompletedDetails.title = "+ Add Address";
          this.uncompletedDetails.page = FormAddress;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          break;
        case "location":
        case "profileSummary":
        case "phone":
        case "subject":
        case "gender":
        case "dob":
        case "grade":
        case "webPages":
          let requiredProfileFields: Array<string> = [
            'lastName',
            'profileSummary',
            'phone',
            'subject',
            'gender',
            'dob',
            'grade',
            'location',
            'webPages'
          ];

          this.uncompletedDetails.title = "+ " + this.profile.missingFields[0];
          this.uncompletedDetails.page = AdditionalInfoComponent;
          this.uncompletedDetails.data = {
            userId: this.userId,
            profile: this.getSubset(requiredProfileFields, this.profile),
            profileVisibility: this.profile.profileVisibility
          }
          break;
      }
    }
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

  scanQRCode() {
    const that = this;
    const callback: QRResultCallback = {
      dialcode(scanResult, dialCode) {
        that.navCtrl.push(SearchPage, { dialCode: dialCode });
      },
      content(scanResult, contentId) {
        // that.navCtrl.push(SearchPage);
        let request: ContentDetailRequest = {
          contentId: contentId
        }
        that.contentService.getContentDetail(request, (response) => {
          let data = JSON.parse(response);
          that.showContentDetails(data.result);
        }, (error) => {
          console.log("Error " + error);
          let toast = that.toastCtrl.create({
            message: "No content found associated with that QR code",
            duration: 3000
          })

          toast.present();
        });
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback, PageId.HOME);
  }

  showContentDetails(content) {
    if (content.contentType === 'Course') {
      console.log('Calling course details page');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      console.log('Calling collection details page');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('Calling content details page');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

}
