import { TelemetryGeneratorService } from './../../service/telemetry-generator.service';
import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {AuthService, Batch, CourseService, EnrollCourseRequest, OAuthSession, SharedPreferences, Rollup, CorrelationData, TelemetryObject} from 'sunbird-sdk';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {EventTopics} from '../../app/app.constant';
import {CommonUtilService} from '../../service/common-util.service';
import { InteractType, InteractSubtype, Environment, PageId } from '@app/service/telemetry-constants';
import { AppHeaderService } from '@app/service';
import moment from 'moment';

/**
 * Generated class for the CourseBatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-course-batches',
  templateUrl: 'course-batches.html',
})
export class CourseBatchesPage implements OnInit {

  /**
   * Contains user id
   */
  public userId: string;

  /**
   * To hold course indentifier
   */
  public identifier: string;

  /**
   * Loader
   */
  public showLoader: boolean;

  /**
   * Contains upcomming batches list
   */
  public upcommingBatches: Array<Batch> = [];

  /**
   * Contains ongoing batches list
   */
  public ongoingBatches: Array<Batch> = [];

  /**
   * Flag to check guest user
   */
  public isGuestUser = false;

  /**
   * Contains batches list
   */
  public batches: Array<Batch> = [];

  public todayDate: any;
  /**
   * Selected filter
   */
  public selectedFilter: string;
  headerConfig = {
    showHeader: false,
    showBurgerMenu: false,
    actionButtons: []
  };
  public showSignInCard = false;
  course: any;
  public objRollup: Rollup;
  public corRelationList: Array<CorrelationData>;
  public telemetryObject: TelemetryObject;
  /**
   * Default method of class CourseBatchesComponent
   *
   * @param {CourseService} courseService To get batches list
   * @param {NavController} navCtrl To redirect form one page to another
   * @param {NavParams} navParams To get url params
   * @param {NgZone} zone To bind data
   * @param {AuthService} authService To get logged-in user data
   */
  constructor(
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('COURSE_SERVICE') private courseService: CourseService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private commonUtilService: CommonUtilService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private headerService: AppHeaderService,
    public toastController: ToastController,
  ) {
  }

  ngOnInit(): void {
    this.getUserId();
    this.getBatchesByCourseId();
  }

  ionViewWillEnter() {
    this.headerConfig = this.headerService.getDefaultPageConfig();
    this.headerConfig.actionButtons = [];
    this.headerConfig.showHeader = false;
    this.headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this.headerConfig);
  }

  /**
   * Enroll logged-user into selected batch
   *
   * @param {any} item contains details of select batch
   */
  enrollIntoBatch(item: Batch): void {
    if (this.isGuestUser) {
      this.showSignInCard = true;
      this.preferences.putString('batch_detail', JSON.stringify(item)).toPromise();
      this.preferences.putString('course_data', JSON.stringify(this.course)).toPromise();
    } else {
      const enrollCourseRequest: EnrollCourseRequest = {
        batchId: item.id,
        courseId: item.courseId,
        userId: this.userId,
        batchStatus: item.status
      };
      const loader = this.commonUtilService.getLoader();
      loader.present();
      const reqvalues = new Map();
      reqvalues['enrollReq'] = enrollCourseRequest;
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.ENROLL_CLICKED,
          Environment.HOME,
          PageId.COURSE_BATCHES, this.telemetryObject,
          reqvalues,
          this.objRollup,
          this.corRelationList
          );

      this.courseService.enrollCourse(enrollCourseRequest).toPromise()
        .then((data: boolean) => {
          this.zone.run(() => {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
            this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
              batchId: item.id,
              courseId: item.courseId
            });
            loader.dismiss();
            this.navCtrl.pop();
          });
        }, (error) => {
          this.zone.run(() => {
            loader.dismiss();
            if (error && error.code === 'NETWORK_ERROR') {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NO_INTERNET_MESSAGE'));
            } else if (error && error.response
              && error.response.body && error.response.body.params && error.response.body.params.err === 'USER_ALREADY_ENROLLED_COURSE') {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('ALREADY_ENROLLED_COURSE'));
            }
          });
        });
    }
  }

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSession().subscribe((session: OAuthSession) => {
      if (!session) {
        this.zone.run(() => {
          this.isGuestUser = true;
        });
      } else {
        this.zone.run(() => {
          this.isGuestUser = false;
          this.userId = session.userToken;
        });
      }
    }, () => {
    });
  }


  /**
   * To get batches, passed from enrolled-course-details page via navParams
   */
  getBatchesByCourseId(): void {
    this.ongoingBatches = this.navParams.get('ongoingBatches');
    this.upcommingBatches = this.navParams.get('upcommingBatches');
    this.course = this.navParams.get('course');
    this.todayDate =  moment(new Date()).format('YYYY-MM-DD');
    this.objRollup = this.navParams.get('objRollup');
    this.corRelationList = this.navParams.get('corRelationList');
    this.telemetryObject = this.navParams.get('telemetryObject');
  }

  spinner(flag) {
    this.zone.run(() => {
      this.showLoader = false;
    });
  }

  showOfflineWarning() {
    let toast =  this.toastController.create({
      duration: 3000,
      message: this.commonUtilService.translateMessage('NO_INTERNET_TITLE'),
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastHeader'
    });
    toast.present();
    toast.onDidDismiss(() => {
      toast = undefined;
    });
  }
}
