import { CommonUtilService } from './../../service/common-util.service';
import { QRScannerAlert, QRAlertCallBack } from './../qrscanner/qrscanner_alert';
import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Navbar,
  Events
} from 'ionic-angular';
import {
  ContentService,
  CorrelationData,
  ChildContentRequest,
  InteractSubtype,
  PageId,
  Profile,
  ProfileService,
  SharedPreferences,
  TabsPage
} from 'sunbird';
import { ContentDetailsPage } from '../content-details/content-details';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentType, MimeType } from '../../app/app.constant';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobalService } from '../../service/app-global.service';
import {
  InteractType,
  Environment,
  ImpressionType
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import * as _ from 'lodash';
import { PopoverController } from 'ionic-angular';
import { Popover } from 'ionic-angular';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { ComponentsModule } from '../../component/components.module';

@IonicPage()
@Component({
  selector: 'page-qr-code-result',
  templateUrl: 'qr-code-result.html'
})
export class QrCodeResultPage {
  unregisterBackButton: any;
  /**
	 * To hold identifier
	 */
  identifier: string;

  /**
	   * To hold identifier
	   */
  searchIdentifier: string;

  /**
	   * Contains children content data
	   */
  childrenData: Array<any>;

  /**
	   * Show loader while importing content
	   */
  showChildrenLoader: boolean;

  /**
	   * Contains card data of previous state
	   */
  content: any;

  /**
	   * Contains Parent Content Details
	   */
  parentContent: any;

  /**
	   * Contains
	   */
  isParentContentAvailable = false;
  profile: Profile;

  corRelationList: Array<CorrelationData>;
  shouldGenerateEndTelemetry = false;
  source = '';
  results: Array<any> = [];
  defaultImg: string;
  parents: Array<any> = [];
  paths: Array<any> = [];
  categories: Array<any> = [];
  boardList: Array<any> = [];
  mediumList: Array<any> = [];
  gradeList: Array<any> = [];
  subjectList: Array<any> = [];
  profileCategories: any;
  isSingleContent = false;

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contentService: ContentService,
    public zone: NgZone,
    public translate: TranslateService,
    public platform: Platform,
    private telemetryGeneratorService: TelemetryGeneratorService,

    private appGlobalService: AppGlobalService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private profileService: ProfileService,
    private events: Events,
    private preferences: SharedPreferences,
    private popOverCtrl: PopoverController,
    private commonUtilService: CommonUtilService,
  ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  /**
	 * Ionic life cycle hook
	 */
  ionViewWillEnter(): void {
    this.content = this.navParams.get('content');
    this.corRelationList = this.navParams.get('corRelation');
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    this.source = this.navParams.get('source');
    this.isSingleContent = this.navParams.get('isSingleContent');

    // check for parent content
    this.parentContent = this.navParams.get('parentContent');
    this.searchIdentifier = this.content.identifier;

    if (this.parentContent) {
      this.isParentContentAvailable = true;
      this.identifier = this.parentContent.identifier;
    } else {
      this.isParentContentAvailable = false;
      this.identifier = this.content.identifier;
    }

    this.getChildContents();
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.handleBackButton(InteractSubtype.DEVICE_BACK_CLICKED);
    }, 10);
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW, '',
      PageId.DIAL_CODE_SCAN_RESULT,
      !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME);

    this.navBar.backButtonClick = () => {
      this.handleBackButton(InteractSubtype.NAV_BACK_CLICKED);
    };
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    if (this.unregisterBackButton) {
      this.unregisterBackButton();
    }
  }

  handleBackButton(clickSource) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      clickSource,
      !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME,
      PageId.DIAL_CODE_SCAN_RESULT);
    if (this.source === PageId.LIBRARY || this.source === PageId.COURSES || !this.isSingleContent) {
      this.navCtrl.pop();
    } else if (this.isSingleContent && this.appGlobalService.isProfileSettingsCompleted) {
      this.navCtrl.setRoot(TabsPage, {
        loginMode: 'guest'
      });
    } else if (this.appGlobalService.isGuestUser && this.isSingleContent && !this.appGlobalService.isProfileSettingsCompleted) {
      this.navCtrl.setRoot(ProfileSettingsPage, {
        isCreateNavigationStack: false,
        hideBackButton: true
      });
    } else {
      this.navCtrl.pop();
    }
  }

  getChildContents() {
    const request: ChildContentRequest = { contentId: this.identifier };
    this.contentService.getChildContents(
      request)
      .then((data: any) => {
        data = JSON.parse(data);
        this.parents.splice(0, this.parents.length);
        this.parents.push(data.result);
        this.results = [];
        this.profile = this.appGlobalService.getCurrentUser();
        const contentData = JSON.parse(JSON.stringify(data.result.contentData));
       /* if (!this.navParams.get('onboarding') && contentData && contentData.medium) {
          this.commonUtilService.changeAppLanguage(contentData.medium);
        } */
        this.checkProfileData(contentData, this.profile);
        this.findContentNode(data.result);

        if (this.results && this.results.length === 0) {
          this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW,
            '',
            PageId.DIAL_LINKED_NO_CONTENT,
            Environment.HOME);
          this.commonUtilService.showContentComingSoonAlert(this.source);
          this.navCtrl.pop();
        }

      })
      .catch((error: string) => {
        console.error('Error: while fetching child contents ===>>>', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
        this.commonUtilService.showContentComingSoonAlert(this.source);
        this.navCtrl.pop();
      });

  }

  private showAllChild(content: any) {
    this.zone.run(() => {
      if (content.children === undefined) {
        if (content.mimeType !== MimeType.COLLECTION) {
          this.results.push(content);

          const path = [];
          this.parents.forEach(ele => {
            path.push(ele);
          });
          path.splice(-1, 1);
          this.paths.push(path);
        }
        return;
      }
      content.children.forEach(child => {
        this.parents.push(child);
        this.showAllChild(child);
        this.parents.splice(-1, 1);
      });
    });
  }

  private findContentNode(data: any) {
    if (data && data !== undefined && data.identifier === this.searchIdentifier) {
      this.showAllChild(data);
      return true;
    }

    if (data && data.children !== undefined) {
      data.children.forEach(child => {
        this.parents.push(child);
        const isFound = this.findContentNode(child);

        if (isFound === true) {
          return true;
        }
        this.parents.splice(-1, 1);
      });
    }

    return false;
  }

  navigateToDetailsPage(content) {
    if (content && content.contentData && content.contentData.contentType === ContentType.COURSE) {
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content && content.mimeType === MimeType.COLLECTION) {
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      });
    } else {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        Boolean(content.isAvailableLocally) ? InteractSubtype.PLAY_CLICKED : InteractSubtype.DOWNLOAD_PLAY_CLICKED,
        !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME,
        PageId.DIAL_CODE_SCAN_RESULT);
      this.navCtrl.push(ContentDetailsPage, {
        content: content,
        depth: '1',
        isChildContent: true,
        downloadAndPlay: true
      });
    }
  }


  /**
	 * Request with profile data to set current profile
	 */

  editProfile(): void {
    const req: Profile = new Profile();
    req.board = this.profile.board;
    req.grade = this.profile.grade;
    req.medium = this.profile.medium;
    req.subject = this.profile.subject;
    req.uid = this.profile.uid;
    req.handle = this.profile.handle;
    req.profileType = this.profile.profileType;
    req.source = this.profile.source;
    req.createdAt = this.profile.createdAt;
    req.syllabus = this.profile.syllabus;
    console.log('qrcode editProfile req', req);
    // Shorthand for above code
    // req = (({board, grade, medium, subject, uid, handle, profileType, source, createdAt, syllabus}) =>
    // ({board, grade, medium, subject, uid, handle, profileType, source, createdAt, syllabus}))(this.profile);
    if (this.profile.grade && this.profile.grade.length > 0) {
      this.profile.grade.forEach(gradeCode => {
        for (let i = 0; i < this.gradeList.length; i++) {
          if (this.gradeList[i].code === gradeCode) {
            req.gradeValueMap = this.profile.gradeValueMap;
            req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name;
            break;
          }
        }
      });
    }

    this.profileService.updateProfile(req)
      .then((res: any) => {
        const updateProfileRes = JSON.parse(res);
        if (updateProfileRes.syllabus && updateProfileRes.syllabus.length && updateProfileRes.board && updateProfileRes.board.length
          && updateProfileRes.grade && updateProfileRes.grade.length && updateProfileRes.medium && updateProfileRes.medium.length) {
          this.events.publish(AppGlobalService.USER_INFO_UPDATED);
          this.events.publish('refresh:profile');
        }
        this.appGlobalService.guestUserProfile = JSON.parse(res);
      })
      .catch((err: any) => {
        console.error('Err', err);
      });
  }

  setGrade(reset, grades) {
    if (reset) {
      this.profile.grade = [];
      this.profile.gradeValueMap = {};
    }
    _.each(grades, (grade) => {
      if (grade && this.profile.grade.indexOf(grade) === -1) {
        if (this.profile.grade && this.profile.grade.length) {
          this.profile.grade.push(grade);
        } else {
          this.profile.grade = [grade];
        }
      }
    });
  }
  /**
	 * @param categoryList
	 * @param data
	 * @param categoryType
	 * return the code of board,medium and subject based on Name
	 */
  findCode(categoryList: Array<any>, data, categoryType) {
    if (_.find(categoryList, (category) => category.name === data[categoryType])) {
      return _.find(categoryList, (category) => category.name === data[categoryType]).code;
    } else {
      return undefined;
    }
  }

  /**
	 * Assigning board, medium, grade and subject to profile
	 */

  setCurrentProfile(index, data) {
    console.log('setCurrentProfile index', index);
    if (!this.profile.medium || !this.profile.medium.length) {
      this.profile.medium = [];
    }
/*     if (!this.profile.subject || !this.profile.subject.length) {
      this.profile.subject = [];
    }
 */    switch (index) {
      case 0:
        this.profile.syllabus = [data.framework];
        this.profile.board = [data.board];
        this.profile.medium = [data.medium];
        // this.profile.subject = [data.subject];
        this.profile.subject = [];
        this.setGrade(true, data.gradeLevel);
        break;
      case 1:
        this.profile.board = [data.board];
        this.profile.medium = [data.medium];
        // this.profile.subject = [data.subject];
        this.profile.subject = [];
        this.setGrade(true, data.gradeLevel);
        break;
      case 2:
        this.profile.medium.push(data.medium);
        break;
      case 3:
        this.setGrade(false, data.gradeLevel);
        break;
/*       case 4:
        this.profile.subject.push(data.subject);
        break;
 */    }
    this.editProfile();
  }

  /**
	 * comparing current profile data with qr result data, If not matching then reset current profile data
	 * @param {object} data
	 * @param {object} profile
	 */
  checkProfileData(data, profile) {
    console.log('qr data', data);
    if (data && data.framework) {

      this.formAndFrameworkUtilService.getSupportingBoardList()
        .then((res) => {
          let isProfileUpdated = false;
          res.forEach(element => {
            // checking whether content data framework Id exists/valid in syllabus list
            if (data.framework === element.frameworkId) {
              isProfileUpdated = true;
              // Get frameworkdetails(categories)
              this.formAndFrameworkUtilService.getFrameworkDetails(data.framework)
                .then(catagories => {
                  this.categories = catagories;
                  this.boardList = _.find(this.categories, (category) => category.code === 'board').terms;
                  this.mediumList = _.find(this.categories, (category) => category.code === 'medium').terms;
                  this.gradeList = _.find(this.categories, (category) => category.code === 'gradeLevel').terms;
                  //                  this.subjectList = _.find(this.categories, (category) => category.code === 'subject').terms;
                  if (data.board) {
                    data.board = this.findCode(this.boardList, data, 'board');
                  }
                  if (data.medium) {
                    data.medium = this.findCode(this.mediumList, data, 'medium');
                  }
                  /*                   if (data.subject) {
                                      data.subject = this.findCode(this.subjectList, data, 'subject');
                                    } */
                  if (data.gradeLevel && data.gradeLevel.length) {
                    data.gradeLevel = _.map(data.gradeLevel, (dataGrade) => {
                      return _.find(this.gradeList, (grade) => grade.name === dataGrade).code;
                    });
                  }
                  if (profile && profile.syllabus && profile.syllabus[0] && data.framework === profile.syllabus[0]) {
                    if (data.board) {
                      if (profile.board && !(profile.board.length > 1) && data.board === profile.board[0]) {
                        if (data.medium) {
                          let existingMedium = false;
                          existingMedium = _.find(profile.medium, (medium) => {
                            return medium === data.medium;
                          });
                          if (!existingMedium) {
                            this.setCurrentProfile(2, data);
                          }
                          if (data.gradeLevel && data.gradeLevel.length) {
                            let existingGrade = false;
                            for (let i = 0; i < data.gradeLevel.length; i++) {
                              const gradeExists = _.find(profile.grade, (grade) => {
                                return grade === data.gradeLevel[i];
                              });
                              if (!gradeExists) {
                                break;
                              }
                              existingGrade = true;
                            }
                            if (!existingGrade) {
                              this.setCurrentProfile(3, data);
                            }
/*                             let existingSubject = false;
                            existingSubject = _.find(profile.subject, (subject) => {
                              return subject === data.subject;
                            });
                            if (!existingSubject) {
                              this.setCurrentProfile(4, data);
                            }
 */                          }
                        }
                      } else {
                        this.setCurrentProfile(1, data);
                      }
                    }
                  } else {
                    this.setCurrentProfile(0, data);
                  }
                }).catch(error => {
                  console.error('Error', error);
                });

              return;
            }
          });
          this.telemetryGeneratorService.generateProfilePopulatedTelemetry(PageId.DIAL_CODE_SCAN_RESULT,
            data.framework, Boolean(isProfileUpdated) ? 'auto' : 'na');
        })
        .catch((error) => {
          console.error('Error', error);
        });
    }
  }

  skipSteps() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SKIP_CLICKED,
      !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME,
      PageId.DIAL_CODE_SCAN_RESULT
    );
    if ((this.appGlobalService.isOnBoardingCompleted && this.appGlobalService.isProfileSettingsCompleted)
      || !this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
      this.navCtrl.setRoot(TabsPage, {
        loginMode: 'guest'
      });
    } else {
      this.navCtrl.setRoot(ProfileSettingsPage);
    }
  }
}

