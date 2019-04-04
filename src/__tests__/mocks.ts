import {FileTransfer} from '@ionic-native/file-transfer';
import {
  AuthService,
  BuildParamService,
  ContainerService,
  ContentService,
  CourseService,
  DeviceInfoService,
  FileUtil,
  FrameworkService,
  OAuthService,
  PageAssembleService,
  ProfileService,
  ReportService,
  SharedPreferences,
  ShareUtil,
  TelemetryService,
  UserProfileService,
  UpdateUserInfoRequest,
  UserExistRequest,
  GenerateOTPRequest,
  GroupService} from 'sunbird';

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
  ToastController
} from 'ionic-angular';

import { NgZone } from '@angular/core';
import { AppGlobalService, CommonUtilService, CourseUtilService, TelemetryGeneratorService } from '@app/service';
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

export const oAuthServiceMock = createSpyObj<OAuthService>([
  'doOAuthStepOne',
  'doOAuthStepTwo',
  'doLogOut'
]);

export const containerServiceMock = createSpyObj<ContainerService>([
  'removeAllTabs',
  'addTab'
]);

export const userProfileServiceMock = createSpyObj<UserProfileService>([
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
  'exportProfile',
  'updateProfile'
]);

export const authServiceMock = createSpyObj<AuthService>([
  'getSessionData',
  'endSession'
]);

export const commonUtilServiceMock = createSpyObj<CommonUtilService>([
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
  'isRTL'
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
  'setContentMarker'
]);

export const popoverCtrlMock = createSpyObj<PopoverController>([
  'create',
  'present',
  'onDidDismiss'
]);

export const fileUtilMock = createSpyObj<FileUtil>([
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

export const shareUtilMock = createSpyObj<ShareUtil>([
  'exportApk',
  'exportTelemetry',
  'exportEcar'
]);

export const buildParamServiceMock = createSpyObj<BuildParamService>([
  'getBuildConfigParam'
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
  'getEnrolledCourseList'
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
  'readLessorReadMore'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>([
  'showCredits',
  'showToast',
  'getImportContentRequestBody',
  'getCourseProgress'
]);

export const appVersionMock = createSpyObj<AppVersion>([
  'getAppName'
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
  'getCustodianOrgId'
]);

export const loadingControllerMock = createSpyObj<LoadingController>([
  'create',
  'present'
]);

export const reportServiceMock = createSpyObj<ReportService>([
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
  'dataDirectory'
]);

export const datePipeMock = createSpyObj<DatePipe>([
  'transform'
]);

export const loadingMock = createSpyObj<LoadingController>([
  'create',
  'dismiss'
]);

export const deviceInfoServiceMock = createSpyObj<DeviceInfoService>([
  'getDeviceID',
  'getDownloadDirectoryPath',
  'getDeviceAPILevel',
  'checkAppAvailability',
  'getDeviceID'
]);

export const viewControllerMock = createSpyObj<ViewController>([
  'dismiss'
]);


export const frameworkServiceMock = createSpyObj<FrameworkService>([
  'getCategoryData',
  'getSuggestedFrameworkList'
]);


export const telemetryServiceMock = createSpyObj<TelemetryService>([
  'impression',
  'interact',
  'getTelemetryStat',
  'sync'
]);


export const supportfileMock = createSpyObj<any>([
  'removeFile',
  'shareSunbirdConfigurations'
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

export const updateUserInfoRequestMock = createSpyObj<UpdateUserInfoRequest>([

]);
export const userExistRequestMock = createSpyObj<UserExistRequest>([

]);

export const generateOTPRequestMock = createSpyObj<GenerateOTPRequest>([

]);

export const networkMock = createSpyObj<Network>([]);

export const appHeaderSrvMock = createSpyObj<AppHeaderService>([]);

