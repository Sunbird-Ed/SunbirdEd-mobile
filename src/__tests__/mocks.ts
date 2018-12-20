import { FileTransfer } from '@ionic-native/file-transfer';
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
  UserProfileService
} from 'sunbird';
import {
  Events,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  PopoverController,
  ViewController,
  App,
  IonicApp
} from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AppGlobalService, CommonUtilService, CourseUtilService, TelemetryGeneratorService } from '@app/service';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { SunbirdQRScanner } from '@app/pages/qrscanner';
import { FormAndFrameworkUtilService } from '@app/pages/profile';
import { File } from '@ionic-native/file';
import { DatePipe } from '../../node_modules/@angular/common';
import { NavControllerBase } from 'ionic-angular/navigation/nav-controller-base';
import { FormBuilder } from '@angular/forms';

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
  'getContentState'
]);

export const navCtrlMock = createSpyObj<NavController>([
  'pop',
  'push',
  'setRoot'
]);

export const navParamsMock = createSpyObj<NavParams>([
  'get'
]);

export const zoneMock = createSpyObj<NgZone>([
  'run'
]);

export const oAuthServiceMock = createSpyObj<OAuthService>([
  'doOAuthStepOne',
  'doOAuthStepTwo'
]);

export const containerServiceMock = createSpyObj<ContainerService>([
  'removeAllTabs',
  'addTab'
]);

export const userProfileServiceMock = createSpyObj<UserProfileService>([
  'getUserProfileDetails',
  'getTenantInfo'
]);

export const profileServiceMock = createSpyObj<ProfileService>([
  'setCurrentProfile',
  'getCurrentUser',
  'doOAuthStepOne'
]);

export const authServiceMock = createSpyObj<AuthService>([
  'getSessionData'
]);

export const commonUtilServiceMock = createSpyObj<CommonUtilService>([
  'getAppDirection',
  'translateMessage',
  'showMessage',
  'showToast',
  'getLoader',
  'getTranslatedValue',
  'showContentComingSoonAlert'
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
  'searchContent'
]);

export const popoverCtrlMock = createSpyObj<PopoverController>([
  'create',
  'present'
]);

export const fileUtilMock = createSpyObj<FileUtil>([
  'internalStoragePath'
]);

export const platformMock = createSpyObj<Platform>([
  'registerBackButtonAction',
  'exitApp'
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
  'getGuestUserType'
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
  'generateExtraInfoTelemetry'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>([
  'showCredits',
  'showToast',
  'getImportContentRequestBody'
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
  'getLibraryFilterConfig'
]);

export const loadingControllerMock = createSpyObj<LoadingController>([
  'create',
  'present'
]);

export const reportServiceMock = createSpyObj<ReportService>([
  'getListOfReports',
  'getImportContentRequestBody',
  'getDetailReport'
]);

export const transferMock = createSpyObj<FileTransfer>([
  'create'
]);

export const fileMock = createSpyObj<File>([
  'writeFile'
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
  'getCategoryData'
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
]);

export const ionicAppMock = createSpyObj<IonicApp>([
]);

export const appMock = createSpyObj<App>([
  'group',
]);
