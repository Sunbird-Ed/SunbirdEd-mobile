import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  PopoverController,
  Platform,
  Navbar,
  AlertController
} from 'ionic-angular';
import * as _ from 'lodash';
import { SocialSharing } from '@ionic-native/social-sharing';

import {
  ContentService,
  FileUtil,
  CourseService,
  ChildContentRequest,
  PageId,
  UserProfileService,
  InteractSubtype,
  Environment,
  Mode,
  InteractType,
  BuildParamService,
  ShareUtil,
  SharedPreferences,
  ProfileType,
  GetContentStateRequest,
  ImpressionType,
  CorrelationData,
  TelemetryObject,
  ErrorCode,
  ErrorType,
  UnenrolCourseRequest,
  CourseBatchStatus,
  CourseBatchesRequest,
  CourseEnrollmentType,
  EnrolledCoursesRequest
} from 'sunbird';
import { ContentRatingAlertComponent, ContentActionsComponent } from '@app/component';
import { CollectionDetailsPage } from '@app/pages/collection-details/collection-details';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import {
  ContentType,
  MimeType,
  EventTopics,
  ShareUrl,
  PreferenceKey
} from '@app/app';
import { CourseBatchesPage } from '@app/pages/course-batches/course-batches';
import { CourseUtilService, AppGlobalService, TelemetryGeneratorService, CommonUtilService } from '@app/service';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-enrolled-course-details',
  templateUrl: 'enrolled-course-details.html',
})
export class EnrolledCourseDetailsPage {

  /**
   * Contains content details
   */
  course: any;

  /**
   * Contains children content data
   */
  childrenData: Array<any> = [];

  startData: any;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Contains total size of locally not available content(s)
   */
  downloadSize = 0;

  /**
   * this hold the mime type of a collection
   */
  enrolledCourseMimeType: string;
  /**
   * Flag to show / hide resume button
   */
  showResumeBtn: boolean;

  /**
   * Contains card data of previous state
   */
  courseCardData: any;

  /**
   * To get course structure keys
   */
  objectKeys = Object.keys;

  /**
   * To hold identifier
   */
  identifier: string;
  /**
   * Contains child content import / download progress
   */
  downloadProgress = 0;

  /**
   * To check batches available or not
   */
  public batches: Array<any>;

  isNavigatingWithinCourse = false;

  /**
   * To hold start date of a course
   */
  courseStartDate;

  showLoading = false;
  showDownloadProgress: boolean;
  totalDownload: number;
  currentCount = 0;
  isDownloadComplete = false;
  queuedIdentifiers: Array<string> = [];
  faultyIdentifiers: Array<any> = [];
  isDownloadStarted = false;
  isDownloadCompleted = false;
  batchDetails: any;
  batchExp: Boolean = false;
  private corRelationList: Array<CorrelationData>;
  userId = '';
  userRating = 0;
  ratingComment = '';
  batchId = '';
  baseUrl = '';
  guestUser = false;
  isAlreadyEnrolled = false;
  profileType = '';
  objId;
  objType;
  objVer;
  didViewLoad: boolean;
  backButtonFunc = undefined;
  shouldGenerateEndTelemetry = false;
  source = '';
  firstChild;
  /**Whole child content is stored and it is used to find first child */
  childContentsData;
  isBatchNotStarted = false;

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private contentService: ContentService,
    private zone: NgZone,
    private events: Events,
    private fileUtil: FileUtil,
    private popoverCtrl: PopoverController,
    private profileService: UserProfileService,
    private courseService: CourseService,
    private buildParamService: BuildParamService,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private preference: SharedPreferences,
    private courseUtilService: CourseUtilService,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private datePipe: DatePipe
  ) {

    this.appGlobalService.getUserId();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.subscribeGenieEvent();
  }

  subscribeUtilityEvents() {
    this.buildParamService.getBuildConfigParam('BASE_URL')
      .then(response => {
        this.baseUrl = response;
      })
      .catch((error) => {
        console.error('Error occurred', error);
      });

    this.events.subscribe(EventTopics.ENROL_COURSE_SUCCESS, (res) => {
      if (res && res.batchId) {
        this.batchId = res.batchId;
        if (this.identifier && res.courseId && this.identifier === res.courseId) {
          this.isAlreadyEnrolled = true;
        }
      }
    });

    this.events.subscribe(EventTopics.UNENROL_COURSE_SUCCESS, () => {
      // to show 'Enroll in Course' button courseCardData.batchId should be undefined/null
      this.updateEnrolledCourseList(this.courseCardData); // enrolled course list updated
      if (this.courseCardData) {
        delete this.courseCardData.batchId;
      }
      delete this.batchDetails;
      // delete this.batchDetails; // to show 'Enroll in Course' button courseCardData should be undefined/null
      this.isAlreadyEnrolled = false; // and isAlreadyEnrolled should be false
    });

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(
        PageId.CONTENT_DETAIL,
        Environment.HOME,
        false,
        this.identifier,
        this.corRelationList
      );
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);

      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.course.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }, 10);
  }

  updateEnrolledCourseList(unenrolledCourse) {
    const enrolledCoursesRequest: EnrolledCoursesRequest = {
      userId: this.appGlobalService.getUserId(),
      refreshEnrolledCourses: false,
      returnRefreshedEnrolledCourses: true
    };
    this.courseService.getEnrolledCourses(enrolledCoursesRequest)
      .then((enrolledCourses: any) => {
        if (enrolledCourses) {
          enrolledCourses = JSON.parse(enrolledCourses);
          this.zone.run(() => {
            // this.enrolledCourses = enrolledCourses.result.courses ? enrolledCourses.result.courses : [];
            // maintain the list of courses that are enrolled, and store them in appglobal
            if (enrolledCourses.length > 0) {
              const courseList: Array<any> = [];
              for (const course of enrolledCourses) {
                courseList.push(course);
              }
              this.appGlobalService.setEnrolledCourseList(courseList);
            }
            this.removeUnenrolledCourse(unenrolledCourse);
          });
        }
      })
      .catch((error: any) => {
        this.removeUnenrolledCourse(unenrolledCourse);
      });
  }

  private removeUnenrolledCourse(unenrolledCourse) {
    const enrolledCourses = this.appGlobalService.getEnrolledCourseList();
    const found = enrolledCourses.find((ele) => {
      return ele.courseId === unenrolledCourse.courseId;
    });
    let indx = -1;
    if (found) {
      indx = enrolledCourses.indexOf(found);
    }
    if (indx !== -1) {
      enrolledCourses.splice(indx, 1);
    }
    this.appGlobalService.setEnrolledCourseList(enrolledCourses);
    this.events.publish(EventTopics.REFRESH_ENROLL_COURSE_LIST, {});
  }

  /**
   * Get the session to know if the user is logged-in or guest
   *
   */
  checkLoggedInOrGuestUser() {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
  }

  checkCurrentUserType() {
    if (this.guestUser) {
      this.appGlobalService.getGuestUserInfo()
        .then((userType) => {
          this.profileType = userType;
        })
        .catch((error) => {
          console.log('Error Occurred', error);
          this.profileType = '';
        });
    }
  }

  /**
   * Function to rate content
   */
  rateContent(event) {
    // TODO: check content is played or not
    if (!this.guestUser) {
      if (this.course.isAvailableLocally) {
        const popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.course,
          rating: this.userRating,
          comment: this.ratingComment,
          pageId: PageId.COURSE_DETAIL
        }, {
            cssClass: 'content-rating-alert'
          });
        popUp.present();
        popUp.onDidDismiss(data => {
          if (data && data.message === 'rating.success') {
            this.userRating = data.rating;
            this.ratingComment = data.comment;
          }
        });
      } else {
        this.commonUtilService.showToast('TRY_BEFORE_RATING');
      }
    } else {
      if (this.profileType === ProfileType.TEACHER) {
        this.commonUtilService.showToast('SIGNIN_TO_USE_FEATURE');
      }
    }
  }


  showOverflowMenu(event) {
    const data = {
      batchStatus: this.batchDetails ? this.batchDetails.status : 2,
      contentStatus: this.courseCardData.status,
      enrollmentType: this.batchDetails ? this.batchDetails.enrollmentType : '',
      courseProgress: this.course.progress
    };
    const contentData = this.course;
    contentData.batchId = this.courseCardData.batchId ? this.courseCardData.batchId : false;
    const popover = this.popoverCtrl.create(ContentActionsComponent, {
      data: data,
      content: contentData,
      batchDetails: this.batchDetails,
      pageName: 'course'
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });

    popover.onDidDismiss(unenrollData => {
      if (unenrollData && unenrollData.caller === 'unenroll') {
        this.handleUnenrollment(unenrollData.unenroll);
      }
    });
  }

  /*
   * check for user confirmation
   * if confirmed then unenrolls the user from the course
   */
  handleUnenrollment(unenroll): void {
    if (unenroll) {
      const loader = this.commonUtilService.getLoader();
      loader.present();
      const unenrolCourseRequest: UnenrolCourseRequest = {
        userId: this.appGlobalService.getUserId(),
        courseId: this.batchDetails.courseId,
        batchId: this.batchDetails.id
      };
      this.courseService.unenrolCourse(unenrolCourseRequest)
        .then((data: any) => {
          this.zone.run(() => {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_UNENROLLED'));
            this.events.publish(EventTopics.UNENROL_COURSE_SUCCESS, {});
            loader.dismiss();
          });
        })
        .catch((error: any) => {
          this.zone.run(() => {
            error = JSON.parse(error);
            if (error && error.error === 'CONNECTION_ERROR') {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NO_INTERNET_MESSAGE'));
            } else {
              this.events.publish(EventTopics.UNENROL_COURSE_SUCCESS, {});
            }
            loader.dismiss();
          });
        });
    }
  }

  /**
   * Set course details by passing course identifier
   * @param {string} identifier
   */
  setContentDetails(identifier): void {
    const option = {
      contentId: identifier,
      refreshContentDetails: true,
      attachFeedback: true,
      attachContentAccess: true
    };

    this.contentService.getContentDetail(option)
      .then((data: any) => {
        this.zone.run(() => {
          data = JSON.parse(data);
          if (data && data.result) {
            this.extractApiResponse(data);
          }
        });
      })
      .catch((error: any) => {
        if (JSON.parse(error).error === 'CONNECTION_ERROR') {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        }
        this.navCtrl.pop();
      });
  }

  /**
   * Function to extract api response. Check content is locally available or not.
   * If locally available then make childContents api call else make import content api call
   * @param data
   */
  extractApiResponse(data): void {
    if (data.result.contentData) {
      this.course = data.result.contentData;
      this.objId = this.course.identifier;
      this.objType = this.course.contentType;
      this.objVer = this.course.pkgVersion;

      if (!this.didViewLoad) {
        this.generateImpressionEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
        this.generateStartEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
      }
      this.didViewLoad = true;

      if (this.course.status !== 'Live') {
        this.commonUtilService.showToast('COURSE_NOT_AVAILABLE');
        this.navCtrl.pop();
      }

      if (this.course.gradeLevel && this.course.gradeLevel.length) {
        this.course.gradeLevel = this.course.gradeLevel.join(', ');
      }

      if (this.course.attributions && this.course.attributions.length) {
        this.course.attributions = this.course.attributions.join(', ');
      }

      if (this.course.me_totalRatings) {
        const rating = this.course.me_totalRatings.split('.');
        if (rating && rating[0]) {
          this.course.me_totalRatings = rating[0];
        }
      }

      // User Rating
      const contentFeedback: any = data.result.contentFeedback ? data.result.contentFeedback : [];
      if (contentFeedback !== undefined && contentFeedback.length !== 0) {
        this.userRating = contentFeedback[0].rating;
        this.ratingComment = contentFeedback[0].comments;
      }
      this.getCourseProgress();
    } else {
      this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
      this.navCtrl.pop();
    }

    if (data.result.isAvailableLocally) {
      this.getBatchDetails();
    }
    this.course.isAvailableLocally = data.result.isAvailableLocally;

    if (this.courseCardData.batchId) {
      // if (this.course.isAvailableLocally === true) {
      // this.getBatchDetails();
    }

    if (Boolean(data.result.isAvailableLocally)) {
      this.setChildContents();
    } else {
      this.showLoading = true;
      this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.course, true);
      this.importContent([this.identifier], false);
    }

    this.setCourseStructure();
  }

  /**
   * Get batch details
   */
  getBatchDetails() {
    this.courseService.getBatchDetails({ batchId: this.courseCardData.batchId })
      .then((data: any) => {
        this.zone.run(() => {
          data = JSON.parse(data);
          if (data.result) {
            this.batchDetails = data.result;
            this.saveContentContext(this.appGlobalService.getUserId(),
              this.batchDetails.courseId, this.courseCardData.batchId, this.batchDetails.status);
            this.preference.getString(PreferenceKey.COURSE_IDENTIFIER)
              .then(val => {
                if (val === this.batchDetails.identifier) {
                  this.batchExp = true;
                } else {
                  if (this.batchDetails.status === 2) {
                    this.batchExp = true;
                    const alert = this.alertCtrl.create({
                      title: this.commonUtilService.translateMessage('BATCH_EXPIRED'),
                      message: this.commonUtilService.translateMessage('BATCH_EXPIRED_DESCRIPTION'),
                      mode: 'wp',
                      cssClass: 'confirm-alert',
                      buttons: [
                        {
                          text: this.commonUtilService.translateMessage('BATCH_EXPIRED_BUTTON'),
                          role: 'cancel',
                          cssClass: 'doneButton',
                          handler: () => {
                            this.preference.putString(PreferenceKey.COURSE_IDENTIFIER, this.batchDetails.identifier);
                          }
                        }
                      ]
                    });
                    alert.present();
                  } else if (this.batchDetails.status === 0) {
                    this.isBatchNotStarted = true;
                    this.courseStartDate = this.batchDetails.startDate;
                  } else {
                    this.batchExp = false;
                  }
                }
              })
              .catch((error) => {
                console.error('ERROR - ' + error);
              });
            this.getBatchCreatorName();
          }
        });
      })
      .catch((error: any) => {
        console.error('error while loading content details', error);
        if (this.courseCardData.batch) {
          this.saveContentContext(this.appGlobalService.getUserId(),
            this.courseCardData.courseId, this.courseCardData.batchId, this.courseCardData.batch.status);
        }
      });
  }

  saveContentContext(userId, courseId, batchId, batchStatus) {
    const contentContextMap = new Map();
    // store content context in the below map
    contentContextMap['userId'] = userId;
    contentContextMap['courseId'] = courseId;
    contentContextMap['batchId'] = batchId;
    if (batchStatus) {
      contentContextMap['batchStatus'] = batchStatus;
    }

    // store the contentContextMap in shared preference and access it from SDK
    this.preference.putString(PreferenceKey.CONTENT_CONTEXT, JSON.stringify(contentContextMap));
  }

  getBatchCreatorName() {
    const req = {
      userId: this.batchDetails.createdBy,
      requiredFields: []
    };
    this.profileService.getUserProfileDetails(req, (data: any) => {
      data = JSON.parse(data);

      if (data) {
        this.batchDetails.creatorFirstName = data.firstName ? data.firstName : '';
        this.batchDetails.creatorLastName = data.lastName ? data.lastName : '';
      }
    }, () => {
    });
  }

  /**
   * Set course structure
   */
  setCourseStructure(): void {
    if (this.course.contentTypesCount) {
      this.course.contentTypesCount = JSON.parse(this.course.contentTypesCount);
    } else if (this.courseCardData.contentTypesCount && !_.isObject(this.courseCardData.contentTypesCount)) {
      this.course.contentTypesCount = JSON.parse(this.courseCardData.contentTypesCount);
    }
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers, isChild: boolean) {
    const requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        destinationFolder: this.fileUtil.internalStoragePath(),
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      });
    });

    return requestParams;
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  importContent(identifiers, isChild: boolean, isDownloadAllClicked?) {
    this.showChildrenLoader = this.downloadIdentifiers.length === 0 ? true : false;
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    };

    this.contentService.importContent(option)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          if (data.result && data.result[0].status === 'NOT_FOUND') {
            this.showLoading = false;
          }

          if (data.result && data.result.length && this.isDownloadStarted) {
            _.forEach(data.result, (value) => {
              if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
                this.queuedIdentifiers.push(value.identifier);
              } else if (value.status === 'NOT_FOUND') {
                this.faultyIdentifiers.push(value.identifier);
              }
            });

            if (isDownloadAllClicked) {
              this.telemetryGeneratorService.generateDownloadAllClickTelemetry(
                PageId.COURSE_DETAIL,
                this.course,
                this.queuedIdentifiers,
                identifiers.length
              );
            }

            if (this.queuedIdentifiers.length === 0) {
              this.restoreDownloadState();
            }
            if (this.faultyIdentifiers.length > 0) {
              const stackTrace: any = {};
              stackTrace.parentIdentifier = this.course.identifier;
              stackTrace.faultyIdentifiers = this.faultyIdentifiers;
              this.telemetryGeneratorService.generateErrorTelemetry(Environment.HOME,
                ErrorCode.ERR_DOWNLOAD_FAILED,
                ErrorType.SYSTEM,
                PageId.COURSE_DETAIL,
                JSON.stringify(stackTrace),
              );
              this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
            }
          }
        });
      })
      .catch((error) => {
        this.zone.run(() => {
          if (this.isDownloadStarted) {
            this.restoreDownloadState();
          } else {
            this.showChildrenLoader = false;
          }
          const errorRes = JSON.parse(error);
          if (errorRes && errorRes.error === 'NETWORK_ERROR') {
            this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
          } else {
            this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
          }
        });
      });
  }

  restoreDownloadState() {
    this.isDownloadStarted = false;
  }

  downloadAllContent() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      if (!this.isBatchNotStarted) {
        this.isDownloadStarted = true;
        this.downloadProgress = 0;
        this.importContent(this.downloadIdentifiers, true, true);
      } else {
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_WILL_BE_AVAILABLE',
          this.datePipe.transform(this.courseStartDate, 'mediumDate')));
      }

    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }
  /**
   * Function to get status of child contents
   */
  getStatusOfChildContent(childrenData, contentStatusData) {
    this.zone.run(() => {
      childrenData.forEach(childContent => {
        // Inside First level
        let contentlen = 0;
        childContent.children.every(eachContent => {
          // Inside resource level
          if (childContent.hasOwnProperty('status') && !childContent.status) {
            // checking for property status
            return false;
          } else {
            // checking for getContentState result length
            if (contentStatusData.result.contentList.length) {
              contentStatusData.result.contentList.every(contentData => {
                // checking for each content status
                if (eachContent.identifier === contentData.contentId) {
                  contentlen = contentlen + 1;
                  // checking for contentId from getContentState and lastReadContentId
                  if (contentData.contentId === this.courseCardData.lastReadContentId) {
                    childContent.lastRead = true;
                  }
                  if (contentData.status === 0 || contentData.status === 1) {
                    // manupulating the status
                    childContent.status = false;
                    return false;
                  } else {
                    // if content played completely
                    childContent.status = true;
                    return true;
                  }
                }
                return true;
              });
              return true;
            } else {
              childContent.status = false;
              return false;
            }
          }
        });

        if (childContent.children.length === contentlen) {
          return true;
        } else {
          childContent.status = false;
          return true;
        }
      });
    });
  }
  /**
   * Function to set child contents
   */
  setChildContents(): void {
    this.showChildrenLoader = true;
    const option = new ChildContentRequest();
    option.contentId = this.identifier;
    option.hierarchyInfo = null;

    if (!this.courseCardData.batchId) {
      option.level = 1;
    }

    this.contentService.getChildContents(option)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          if (data && data.result && data.result.children) {
            this.enrolledCourseMimeType = data.result.mimeType;
            this.childrenData = data.result.children;
            this.startData = data.result.children;
            this.childContentsData = data.result;
            this.getContentState(!this.isNavigatingWithinCourse);
          }
          if (this.courseCardData.batchId) {
            this.downloadSize = 0;
            this.getContentsSize(this.childrenData);
          }
          this.showChildrenLoader = false;
        });
      })
      .catch((error: string) => {
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
  }

  /**
   * Redirect to child content details page
   * @param content
   * @param depth
   */
  navigateToChildrenDetailsPage(content, depth): void {
    const contentState = {
      batchId: this.courseCardData.batchId ? this.courseCardData.batchId : '',
      courseId: this.identifier
    };
    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState
        });
      } else if (content.mimeType === MimeType.COLLECTION) {
        let isChildClickable = true;
        if (this.isAlreadyEnrolled && this.isBatchNotStarted) {
          isChildClickable = false;
        }
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState,
          fromCoursesPage: true,
          isAlreadyEnrolled: this.isAlreadyEnrolled,
          isChildClickable: isChildClickable
        });
      } else {
        this.navCtrl.push(ContentDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState,
          isChildContent: true
        });
      }
    });
  }

  cancelDownload() {
    this.telemetryGeneratorService.generateCancelDownloadTelemetry(this.course);
    this.contentService.cancelDownload(this.identifier).then(() => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    }).catch(() => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    });
  }

  getContentsSize(data) {
    _.forEach(data, (value) => {
      if (value.contentData.size) {
        this.downloadSize += Number(value.contentData.size);
      }
      this.getContentsSize(value.children);
      if (value.isAvailableLocally === false) {
        this.downloadIdentifiers.push(value.contentData.identifier);
      }
    });
  }

  /**
   * Function gets executed when user click on resume course button.
   * @param {string} identifier
   */
  resumeContent(identifier): void {
    this.showResumeBtn = false;
    this.navCtrl.push(ContentDetailsPage, {
      content: { identifier: identifier },
      depth: '1', // Needed to handle some UI elements.
      contentState: {
        batchId: this.courseCardData.batchId ? this.courseCardData.batchId : '',
        courseId: this.identifier
      },
      isResumedCourse: true,
      isChildContent: true
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.downloadSize = 0;
    this.courseCardData = this.navParams.get('content');
    this.corRelationList = this.navParams.get('corRelation');
    this.source = this.navParams.get('source');
    this.identifier = this.courseCardData.contentId || this.courseCardData.identifier;
    // check if the course is already enrolled
    this.isCourseEnrolled(this.identifier);
    if (this.batchId) {
      this.courseCardData.batchId = this.batchId;
    }
    this.showResumeBtn = this.courseCardData.lastReadContentId ? true : false;
    this.setContentDetails(this.identifier);
    // If courseCardData does not have a batch id then it is not a enrolled course
    this.subscribeGenieEvent();
  }


  isCourseEnrolled(identifier: string) {
    // get all the enrolled courses
    const enrolledCourses = this.appGlobalService.getEnrolledCourseList();
    if (enrolledCourses && enrolledCourses.length > 0) {
      for (const course of enrolledCourses) {
        if (course.courseId === identifier) {
          this.isAlreadyEnrolled = true;
          this.courseCardData = course;
        }
      }
    }
  }

  getCourseProgress() {
    if (this.courseCardData.batchId) {
      this.course.progress = this.courseUtilService.getCourseProgress(this.courseCardData.leafNodesCount, this.courseCardData.progress);
      this.course.progress = parseInt(this.course.progress, 10);
    }
  }

  /**
   * Subscribe genie event to get content download progress
   */
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        const res = data;

        // Show download percentage
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          if (res.data.downloadProgress === -1 || res.data.downloadProgress === '-1') {
            this.downloadProgress = 0;
          } else {
            this.downloadProgress = res.data.downloadProgress;
          }

          if (this.downloadProgress === 100) {
            this.getBatchDetails();
            this.showLoading = false;
          }
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          this.showLoading = false;
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
            }

            if (this.queuedIdentifiers.length === this.currentCount) {
              this.isDownloadStarted = false;
              this.currentCount = 0;
              this.isDownloadCompleted = true;
              this.downloadIdentifiers.length = 0;
              this.queuedIdentifiers.length = 0;
            }
          } else {
            this.course.isAvailableLocally = true;
            this.setChildContents();
          }
        }

        // For content update available
        const hierarchyInfo = this.courseCardData.hierarchyInfo ? this.courseCardData.hierarchyInfo : null;

        if (res.data && res.type === 'contentUpdateAvailable' && hierarchyInfo === null) {
          this.zone.run(() => {
            this.showLoading = true;
            this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.course, false);
            this.importContent([this.identifier], false);
          });
        }

      });
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.isNavigatingWithinCourse = true;
    this.events.unsubscribe('genie.event');
    // TODO: this.events.unsubscribe(EventTopics.UNENROL_COURSE_SUCCESS);
  }

  /**
   * checks whether batches are available or not and then Navigate user to batch list page
   */
  navigateToBatchListPage(): void {
    const ongoingBatches = [];
    const upcommingBatches = [];
    const loader = this.commonUtilService.getLoader();
    const courseBatchesRequest: CourseBatchesRequest = {
      courseId: this.identifier,
      enrollmentType: CourseEnrollmentType.OPEN,
      status: [CourseBatchStatus.NOT_STARTED, CourseBatchStatus.IN_PROGRESS]
    };
    const reqvalues = new Map();
    reqvalues['enrollReq'] = courseBatchesRequest;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.ENROLL_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL, undefined,
      reqvalues);

    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      if (!this.guestUser) {
        loader.present();
        this.courseService.getCourseBatches(courseBatchesRequest)
          .then((data: any) => {
            data = JSON.parse(data);
            this.zone.run(() => {
              this.batches = data.result.content;
              if (this.batches.length) {
                _.forEach(this.batches, (batch, key) => {
                  if (batch.status === 1) {
                    ongoingBatches.push(batch);
                  } else {
                    upcommingBatches.push(batch);
                  }
                });
                loader.dismiss();
                this.navCtrl.push(CourseBatchesPage, {
                  ongoingBatches: ongoingBatches,
                  upcommingBatches: upcommingBatches
                });
              } else {
                loader.dismiss();
                this.commonUtilService.showToast('NO_BATCHES_AVAILABLE');
              }
            });
          })
          .catch((error: any) => {
            console.log('error while fetching course batches ==>', error);
          });
      } else {
        this.navCtrl.push(CourseBatchesPage);
      }
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }
  /**
   * Loads first children with in the start data
   */
  loadFirstChildren(data) {
    if (data && (data.children === undefined)) {
      return data;
    } else {
      for (let i = 0; i < data.children.length; i++) {
        return this.loadFirstChildren(data.children[i]);
      }
    }
  }

  /**
   * Get executed when user click on start button
   */
  startContent() {
    if (this.startData && this.startData.length && !this.isBatchNotStarted) {
      this.firstChild = this.loadFirstChildren(this.childContentsData);
      this.navigateToChildrenDetailsPage(this.firstChild, 1);
    } else {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_WILL_BE_AVAILABLE',
        this.datePipe.transform(this.courseStartDate, 'mediumDate')));
    }
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_COURSE_INITIATED, this.course.contentType);
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const url = this.baseUrl + ShareUrl.COLLECTION + this.course.identifier;
    if (this.course.isAvailableLocally) {
      this.shareUtil.exportEcar(this.course.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
        this.social.share('', '', 'file://' + path, url);
      }, () => {
        loader.dismiss();
        this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
      this.social.share('', '', '', url);
    }
  }

  generateShareInteractEvents(interactType, subType, contentType) {
    const values = new Map();
    values['ContentType'] = contentType;
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
      subType,
      Environment.HOME,
      PageId.CONTENT_DETAIL, undefined,
      values,
      undefined,
      this.corRelationList
    );
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        true, this.identifier, this.corRelationList);
      this.handleNavBackButton();
    };

    this.subscribeUtilityEvents();
  }

  handleNavBackButton() {
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.course.identifier);
    }
    this.navCtrl.pop();
    this.backButtonFunc();
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      const telemetryObject: TelemetryObject = { id: qrData, type: 'qr', version: undefined, rollup: undefined };
      this.telemetryGeneratorService.generateEndTelemetry(
        'qr',
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject,
        undefined,
        this.corRelationList);
    }
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.DETAIL,
      '', PageId.COURSE_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      undefined,
      this.corRelationList);
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = { id: objectId, type: objectType, version: objectVersion, rollup: undefined };
    this.telemetryGeneratorService.generateStartTelemetry(PageId.COURSE_DETAIL,
      telemetryObject,
      undefined,
      this.corRelationList
    );
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = { id: objectId, type: objectType, version: objectVersion, rollup: undefined };
    this.telemetryGeneratorService.generateEndTelemetry(objectType,
      Mode.PLAY,
      PageId.COURSE_DETAIL,
      Environment.HOME,
      telemetryObject,
      undefined,
      this.corRelationList);
  }

  /**
   * Opens up popup for the credits.
   */
  viewCredits() {
    this.courseUtilService.showCredits(this.course, PageId.CONTENT_DETAIL, undefined, this.corRelationList);
  }

  getContentState(returnRefresh: boolean) {
    if (this.courseCardData.batchId) {
      const request: GetContentStateRequest = {
        userId: this.appGlobalService.getUserId(),
        courseIds: [this.identifier],
        returnRefreshedContentStates: returnRefresh,
        batchId: this.batchId
      };
      this.courseService.getContentState(request).then((success: any) => {
        success = JSON.parse(success);
        if (this.childrenData) {
          this.getStatusOfChildContent(this.childrenData, success);
        }
      }).catch((error: any) => {

      });
    } else {
      // to be handled when there won't be any batchId
    }
  }

}
