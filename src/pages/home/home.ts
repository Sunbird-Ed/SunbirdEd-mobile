import { Component, NgZone } from '@angular/core';
import { NavController, Events, Platform, ToastController } from 'ionic-angular';
import { DocumentDirection } from 'ionic-angular/platform/platform';
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
  UserProfileDetailsRequest
} from 'sunbird';
import { AnnouncementListComponent } from './announcement-list/announcement-list';
import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { IncompleteProfileData } from '../../component/card/incomplete-profile/incomplete-profile-data';
import { TranslateService } from '@ngx-translate/core';
import { ProfileConstants, ContentCard } from '../../app/app.constant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService, AnnouncementService]

})
export class HomePage {

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

  currentStyle = 'ltr';

  /**
   * Contains Profile Object
   */
  profile: any = {};

  /**
   * Flag to check if profile is incomplete
   */
  isProfileIncomplete = false;

  profileProgress = '';

  incompleteProfileData: IncompleteProfileData;

  layoutInProgress = ContentCard.LAYOUT_INPROGRESS;

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl Reference of nav controller to navigate user from one page to another
   * @param {HttpClient} http Reference of http client service to make api call
   */

  logo = 'assets/imgs/ic_launcher.png';

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
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private translate: TranslateService
    // private storage: Storage
  ) {
    this.getUserId();
    // // TODO: remove this hardcodec id before pushing the code
    // this.userId = '659b011a-06ec-4107-84ad-955e16b0a48a';
    this.events.subscribe('genie.event', (response) => {
      console.log('Result ' + response);
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
    const option = {
      userId: this.userId,
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(option)
      .then((data: any) => {
        if (data) {
          data = JSON.parse(data);
          this.ngZone.run(() => {
            this.enrolledCourse = data.result.courses ? data.result.courses : [];
            this.spinner(false);
          });
        }
      })
      .catch((error: any) => {
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
    const option = {
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
        });
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
    this.getUserId();
    this.getAnnouncementList();
  }

  changeLanguage(event) {
    if (this.currentStyle === 'ltr') {
      this.currentStyle = 'rtl';
    } else {
      this.currentStyle = 'ltr';
    }
    this.platform.setDir(this.currentStyle as DocumentDirection, true);
  }

  ionViewDidLoad() {
    this.refreshTenantData();
  }

  refreshTenantData() {
    const request = new TenantInfoRequest();
    request.refreshTenantInfo = true;
    request.slug = 'sunbird';
    this.userProfileService.getTenantInfo(
      request,
      res => {
        this.ngZone.run(() => {
          const r = JSON.parse(res);
          this.logo = r['logo'];
        });
      },
      error => {

      }
    );
  }

  onSyncClick() {
    this.telemetryService.sync().then((response) => {
      console.log('Telemetry Home : ' + response);
    }).catch((error) => {
      console.log('Telemetry Home : ' + error);
    });
    this.downloadContent();
  }

  downloadContent() {
    const contentImport = new ContentImport();

    contentImport.contentId = 'do_2123823398249594881455';
    contentImport.destinationFolder = '/storage/emulated/0/Android/data/org.sunbird.app/files';

    const contentImportRequest = new ContentImportRequest();

    contentImportRequest.contentImportMap = {
      'do_2123823398249594881455': contentImport
    };
    console.log('Hello ' + JSON.stringify(contentImportRequest));
    this.contentService.importContent(contentImportRequest)
    .then((response) => {
      console.log('Home : ' + response);
    }) .then((error) => {
      console.log('Home : ' + error);
    });
  }

  search() {
    const contentType: Array<string> = [
      'Story',
      'Worksheet',
      'Game',
      'Collection',
      'TextBook',
      'Course',
      'LessonPlan',
      'Resource',
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType, source: PageId.HOME });
  }

  /**
  * Get user id.
  *
  * Used to get enrolled course(s) of logged-in user
  */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.log('session expired');
      } else {
        this.getProfileCompletionDetails(session);
      }
    });
  }

  getProfileCompletionDetails(session: any) {
    const sessionObj = JSON.parse(session);
    this.userId = sessionObj[ProfileConstants.USER_TOKEN];

    const req: UserProfileDetailsRequest = {
      userId:
        this.userId && this.userId !== sessionObj[ProfileConstants.USER_TOKEN]
          ? this.userId
          : sessionObj[ProfileConstants.USER_TOKEN],
      requiredFields: ProfileConstants.REQUIRED_FIELDS,
      refreshUserProfileDetails: true
    };

    this.userProfileService.getUserProfileDetails(
      req,
      (res: any) => {
        this.ngZone.run(() => {
          const r = JSON.parse(res);
          this.profile = r;
          this.incompleteProfileData = new IncompleteProfileData();
          this.formatProfileProgress();
          this.getEnrolledCourses();
        });
      },
      (error: any) => {
        console.error(error);
        this.getEnrolledCourses();
      }
    );
  }

  formatProfileProgress() {
    this.profileProgress = String(this.profile.completeness);
    this.incompleteProfileData.profileCompleteness = this.profileProgress;
  }

  completeProfile() {
    // if (this.uncompletedDetails.page === 'picture') {
    //   this.editPicture();
    // } else {
    //   this.navCtrl.push(this.uncompletedDetails.page, this.uncompletedDetails.data);
    // }
  }

  /**
    * Shows the pop up with current Image or open camera instead.
     */
  editPicture() {
    // let popover = this.popoverCtrl.create(ImagePicker,
    //   {
    //     imageUri: this.imageUri,
    //     profile: this.profile
    //   });
    // popover.present();
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
    this.qrScanner.startScanner(PageId.HOME);
  }


  showMessage(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  getMessageByConst(constant) {
    this.translate.get(constant).subscribe(
      (value: any) => {
        this.showMessage(value);
      }
    );
  }

}
