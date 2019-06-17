import { AndroidPermissionsService } from '@app/service/android-permissions/android-permissions.service';
import { FileTransfer } from '@ionic-native/file-transfer';
import {
  AuthService,
  ContentService,
  CourseService,
  FrameworkService,
  PageAssembleService,
  ProfileService,
  SummarizerService,
  SharedPreferences,
  TelemetryService,
  GenerateOtpRequest,
  GroupService,
  DownloadService,
  EventsBusService,
  PlayerService,
  NotificationService
} from 'sunbird-sdk';
import { CanvasPlayerService } from '../pages/player/canvas-player.service';
import {
  App,
  Events,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  PopoverController,
  ViewController,
  IonicApp,
  AlertController,
  ToastController,
  Navbar
} from 'ionic-angular';

import { NgZone } from '@angular/core';
import {
  AppGlobalService,
  AppRatingService,
  CommonUtilService,
  CourseUtilService,
  TelemetryGeneratorService
} from '@app/service';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { SunbirdQRScanner } from '@app/pages/qrscanner';
import { FormAndFrameworkUtilService } from '@app/pages/profile';
import { File } from '@ionic-native/file';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';
import { LogoutHandlerService } from '@app/service/handlers/logout-handler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageLoader } from 'ionic-image-loader';
import { Network } from '@ionic-native/network';
import { AppHeaderService } from '@app/service';
import { ContainerService } from "@app/service/container.services";
import { UtilityService } from "@app/service";
import { FileSizePipe } from '../pipes/file-size/file-size';

export type Mockify<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

const createSpyObj: <T extends {}>(methodNames: string[]) => Mockify<T> = (methodNames: string[]) => {
  const obj: any = {};
  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn(() => {
    });
  }
  return obj;
};

export const courseServiceMock = createSpyObj<CourseService>([
  'getEnrolledCourses',
  'enrollCourse',
  'updateContentState',
  'getCourseBatches',
  'getBatchDetails',
  'getContentState',
  'unenrolCourse'
]);

export const navCtrlMock = createSpyObj<NavController>([
  'pop',
  'push',
  'setRoot',
  'popTo',
  'canGoBack'
]);

export const navParamsMock = createSpyObj<NavParams>([
  'get'
]);

export const zoneMock = createSpyObj<NgZone>([
  'run'
]);

export const oAuthServiceMock = createSpyObj<AuthService>([
  'setSession',
  'getSession',
  'resignSession',
  'refreshSession'
]);

export const containerServiceMock = createSpyObj<ContainerService>([
  'removeAllTabs',
  'addTab'
]);

export const userProfileServiceMock = createSpyObj<ProfileService>([
  'getUserProfileDetails',
  'getTenantInfo',
  'searchLocation',
  'updateUserInfo',
  'isAlreadyInUse',
  'generateOTP',
  'verifyOTP',
  'generateOTP'
]);

export const profileServiceMock = createSpyObj<ProfileService>([
  'setCurrentProfile',
  'getCurrentUser',
  'doOAuthStepOne',
  'getProfile',
  'getAllUserProfile',
  'getAllProfile',
  'getAllProfiles',
  'exportProfile',
  'updateProfile'
]);

export const authServiceMock = createSpyObj<AuthService>([
  'getSessionData',
  'endSession'
]);

export const commonUtilServiceMock = createSpyObj<CommonUtilService>([
  'networkAvailability',
  'getAppDirection',
  'translateMessage',
  'showMessage',
  'showToast',
  'getLoader',
  'getTranslatedValue',
  'showContentComingSoonAlert',
  'toLocaleUpperCase',
  'showExitPopUp',
  'arrayToString',
  'isRTL',
  'fileSizeInMB'
]);

export const eventsMock = createSpyObj<Events>([
  'publish',
  'subscribe',
  'unsubscribe'
]);

export const contentServiceMock = createSpyObj<ContentService>([
  'getContentDetail',
  'getLocalContents',
  'importContent',
  'getChildContents',
  'cancelDownload',
  'searchContent',
  'getChildContents',
  'sendFeedback',
  'deleteContent',
  'getAllLocalContents',
  'setContentMarker',
  'getContents',
  'getContentSpaceUsageSummary',
  'clearContentDeleteQueue',
  'enqueueContentDelete',
  'getContentDeleteQueue'
]);

export const popoverCtrlMock = createSpyObj<PopoverController>([
  'create',
  'present',
  'onDidDismiss'
]);

export const fileUtilMock = createSpyObj<File>([
  'internalStoragePath'
]);

export const platformMock = createSpyObj<Platform>([
  'registerBackButtonAction',
  'exitApp',
  'resume'
]);

export const translateServiceMock = createSpyObj<TranslateService>([
  'use',
  'get'
]);


export const socialSharingMock = createSpyObj<SocialSharing>([
  'shareViaEmail',
  'share',
  'use'
]);

export const shareUtilMock = createSpyObj<UtilityService>([
  'exportApk',
  'exportTelemetry',
  'exportEcar'
]);

export const buildParamServiceMock = createSpyObj<UtilityService>([
  'getBuildConfigValue',
  'getDeviceAPILevel',
  'checkAppAvailability'
]);
export const headerServiceMock = createSpyObj<AppHeaderService>([
  'showHeaderWithBackButton',
  'hideHeader'
]);
export const appGlobalServiceMock = createSpyObj<AppGlobalService>([
  'isUserLoggedIn',
  'getGuestUserInfo',
  'generateConfigInteractEvent',
  'openPopover',
  'setEnrolledCourseList',
  'getSessionData',
  'getCurrentUser',
  'getNameForCodeInFramework',
  'getGuestUserType',
  'setAverageTime',
  'setAverageScore',
  'getAverageScore',
  'getAverageTime',
  'getUserId',
  'getGuestUserInfo',
  'getEnrolledCourseList',
  'getSelectedBoardMediumGrade',
  'setIsPermissionAsked'
]);

export const telemetryGeneratorServiceMock = createSpyObj<TelemetryGeneratorService>([
  'generateStartTelemetry',
  'generateImpressionTelemetry',
  'generateSpineLoadingTelemetry',
  'generateCancelDownloadTelemetry',
  'generateInteractTelemetry',
  'generateEndTelemetry',
  'generatePageViewTelemetry',
  'generateBackClickedTelemetry',
  'generateLogEvent',
  'generateExtraInfoTelemetry',
  'readLessorReadMore',
  'isCollection'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>([
  'showCredits',
  'showToast',
  'getImportContentRequestBody',
  'getCourseProgress'
]);

export const appVersionMock = createSpyObj<AppVersion>([
  'getAppName',
  'getPackageName'
]);

export const pageAssembleServiceMock = createSpyObj<PageAssembleService>([
  'getPageAssemble'
]);

export const sharedPreferencesMock = createSpyObj<SharedPreferences>([
  'getString',
  'putString',
  'getImportContentRequestBody',
  'showToast',
  'getStringWithoutPrefix',
]);


export const sunbirdQRScannerMock = createSpyObj<SunbirdQRScanner>([
  'startScanner',
  'getImportContentRequestBody',
  'getLibraryFilterConfig'
]);

export const formAndFrameworkUtilServiceMock = createSpyObj<FormAndFrameworkUtilService>([
  'getCourseFilterConfig',
  'updateLoggedInUser',
  'getLibraryFilterConfig',
  'getSupportingBoardList',
  'getFrameworkDetails',
  'getCategoryData',
  'getCourseFrameworkId',
  'getRootOrganizations',
  'getCustodianOrgId',
  'getConsumptionFaqsUrl'
]);

export const loadingControllerMock = createSpyObj<LoadingController>([
  'create',
  'present'
]);

export const reportServiceMock = createSpyObj<SummarizerService>([
  'getListOfReports',
  'getImportContentRequestBody',
  'getDetailReport',
  'getDetailsPerQuestion',
  'getReportsByUser',
  'getReportsByQuestion'
]);

export const transferMock = createSpyObj<FileTransfer>([
  'create'
]);

export const fileMock = createSpyObj<File>([
  'writeFile',
  'createDir',
  'dataDirectory',
  'readAsText'
]);

export const datePipeMock = createSpyObj<DatePipe>([
  'transform'
]);

export const loadingMock = createSpyObj<LoadingController>([
  'create',
  'dismiss'
]);

export const deviceInfoServiceMock = createSpyObj<UtilityService>([
  'getDeviceID',
  'getDownloadDirectoryPath',
  'getDeviceAPILevel',
  'checkAppAvailability',
  'getDeviceID',
  'getAvailableInternalMemorySize'
]);

export const viewControllerMock = createSpyObj<ViewController>([
  'dismiss',
  'onDidDismiss'
]);


export const frameworkServiceMock = createSpyObj<FrameworkService>([
  'getCategoryData',
  'getSuggestedFrameworkList'
]);


export const telemetryServiceMock = createSpyObj<TelemetryService>([
  'impression',
  'interact',
  'getTelemetryStat',
  'sync',
  'generateInteractTelemetry'
]);

export const formBuilderMock = createSpyObj<FormBuilder>([
  'group',
  'fb'
]);
export const formGroupMock = createSpyObj<FormGroup>([
  'getRawValue'
]);

export const ionicAppMock = createSpyObj<IonicApp>([]);

export const appMock = createSpyObj<App>([
  'group',
]);

export const tncUpdateHandlerServiceMock = createSpyObj<TncUpdateHandlerService>([
  'presentTncPage',
  'onAcceptTnc',
  'dismissTncPage'
]);

export const logoutHandlerServiceMock = createSpyObj<LogoutHandlerService>([
  'onLogout'
]);

export const domSanitizerMock = createSpyObj<DomSanitizer>([
  'bypassSecurityTrustResourceUrl'
]);


export const alertCtrlMock = createSpyObj<AlertController>([
  'present',
  'dismiss',
  'create'
]);

export const groupServiceMock = createSpyObj<GroupService>([
  'setCurrentGroup',
  'deleteGroup',
  'addUpdateProfilesToGroup',
  'updateGroup',
  'addUpdateProfilesToGroup',
  'getAllGroup'
]);

export const alertControllerMock = createSpyObj<AlertController>([
  'create',
]);

export const toastControllerMock = createSpyObj<ToastController>([
  'create'
]);
export const imageLoaderMock = createSpyObj<ImageLoader>([

]);

export const updateUserInfoRequestMock = createSpyObj<ProfileService>([

]);

export const generateOTPRequestMock = createSpyObj<GenerateOtpRequest>([

]);

export const networkMock = createSpyObj<Network>([]);

export const appHeaderServiceMock = createSpyObj<AppHeaderService>([
  'getDefaultPageConfig',
  'updatePageConfig',
  'unsubscribe',
  'showHeaderWithHomeButton',
  'showHeaderWithBackButton',
  'hideHeader'
]);

export const utilityServiceMock = createSpyObj<UtilityService>([
  'openPlayStore'
]);
export const appRatingServiceMock = createSpyObj<AppRatingService>([
  'setInitialDate',
  'checkInitialDate',
  'setEndStoreRate',
  'createFolder',
]);
export const downloadServiceMock = createSpyObj<DownloadService>([
  'getActiveDownloadRequests',
  'cancel',
  'cancelAll'
]);
export const eventBusServiceMock = createSpyObj<EventsBusService>([
  'events',
  'getContentDownloadProgress',
  'unsubscribe'
]);
export const playerServiceMock = createSpyObj<PlayerService>([
  'getPlayerConfig'
]);
export const canvasPlayerServiceMock = createSpyObj<CanvasPlayerService>([

]);
export const fileSizePipeMock = createSpyObj<FileSizePipe>([

]);

export const permissionServiceMock = createSpyObj<AndroidPermissionsService>([
  'checkPermissions',
  'requestPermissions'
]);

export const notificationServiceMock = createSpyObj<NotificationService>([
  'addNotification',
  'updateNotification',
  'getAllNotifications',
  'deleteNotification'
]);


export const NavbarMock = createSpyObj<Navbar>([
  'backButtonClick'
]);
