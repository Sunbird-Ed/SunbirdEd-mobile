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
import { FormEducation } from '../profile/education/form.education';
import { FormAddress } from '../profile/address/form.address';
import { FormExperience } from '../profile/experience/form.experience';
import { AdditionalInfoComponent } from '../profile/additional-info/additional-info';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { IncompleteProfileData } from '../../component/card/incomplete-profile/incomplete-profile-data';
import { TranslateService } from '@ngx-translate/core';
import { ProfileConstants } from '../../app/app.constant';

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

  uncompletedDetails: any = {
    title: ''
  };

  /**
   * Flag to check if profile is incomplete
   */
  isProfileIncomplete = false;

  profileProgress = '';

  incompleteProfileData: IncompleteProfileData;

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
    this.courseService.getEnrolledCourses(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.ngZone.run(() => {
          this.enrolledCourse = data.result.courses ? data.result.courses : [];
          this.spinner(false);
        });
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
    this.telemetryService.sync((response) => {
      console.log('Telemetry Home : ' + response);
    }, (error) => {
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
    this.contentService.importContent(contentImportRequest, (response) => {
      console.log('Home : ' + response);
    }, (error) => {
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
        case 'education':
          this.uncompletedDetails.title = '+ Add Education';
          this.uncompletedDetails.page = FormEducation;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          this.isProfileIncomplete = true;
          this.incompleteProfileData.completenessRequires = '+ Add Education';
          this.incompleteProfileData.avatar = this.profile.avatar;
          break;
        case 'jobProfile':
          this.uncompletedDetails.title = '+ Add Experience';
          this.uncompletedDetails.page = FormExperience;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          this.isProfileIncomplete = true;
          this.incompleteProfileData.completenessRequires = '+ Add Experience';
          this.incompleteProfileData.avatar = this.profile.avatar;
          break;
        case 'avatar':
          this.uncompletedDetails.title = '+ Add Avatar';
          this.uncompletedDetails.page = 'picture';
          this.isProfileIncomplete = true;
          this.incompleteProfileData.completenessRequires = '+ Add Avatar';
          this.incompleteProfileData.avatar = '';
          break;
        case 'address':
          this.uncompletedDetails.title = '+ Add Address';
          this.uncompletedDetails.page = FormAddress;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          this.isProfileIncomplete = true;
          this.incompleteProfileData.completenessRequires = '+ Add Address';
          this.incompleteProfileData.avatar = this.profile.avatar;
          break;
        case 'location':
        case 'profileSummary':
        case 'phone':
        case 'subject':
        case 'gender':
        case 'dob':
        case 'grade':
        case 'webPages':
          const requiredProfileFields: Array<string> = [
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

          this.uncompletedDetails.title = '+ Add ' + this.profile.missingFields[0];
          this.uncompletedDetails.page = AdditionalInfoComponent;
          this.uncompletedDetails.data = {
            userId: this.userId,
            profile: this.getSubset(requiredProfileFields, this.profile),
            profileVisibility: this.profile.profileVisibility
          };
          this.isProfileIncomplete = true;
          this.incompleteProfileData.completenessRequires = '+ Add ' + this.profile.missingFields[0];
          this.incompleteProfileData.avatar = this.profile.avatar;
          break;
      }

      console.log('Incomplete profile details - ' + this.incompleteProfileData);
    }
  }

  formatProfileProgress() {
    this.profileProgress = String(this.profile.completeness);
    this.incompleteProfileData.profileCompleteness = this.profileProgress;
  }

  completeProfile() {
    if (this.uncompletedDetails.page === 'picture') {
      this.editPicture();
    } else {
      this.navCtrl.push(this.uncompletedDetails.page, this.uncompletedDetails.data);
    }
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
