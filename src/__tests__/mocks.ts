import {
  AuthService,
  BuildParamService,
  ContentService,
  CourseService,
  FileUtil,
  PageAssembleService,
  SharedPreferences,
  ShareUtil,
  ReportService
} from 'sunbird';
import {Events, NavController, NavParams, Platform, PopoverController, LoadingController} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {AppGlobalService, CommonUtilService, CourseUtilService, TelemetryGeneratorService} from '@app/service';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing';
import {AppVersion} from '@ionic-native/app-version';
import {SunbirdQRScanner} from '@app/pages/qrscanner';
import {FormAndFrameworkUtilService} from '@app/pages/profile';

export type Mockify<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

const createSpyObj: <T extends {}>(methodNames: string[]) => Mockify<T>  = (methodNames: string[]) => {
  const obj: any = {};
  for (let i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = jest.fn(() => {});
  }
  return obj;
};

export const courseServiceMock = createSpyObj<CourseService>([
  'getEnrolledCourses', 'enrollCourse', 'updateContentState', 'getCourseBatches',
  'getBatchDetails', 'getContentState']);

export const navCtrlMock = createSpyObj<NavController>(['pop', 'push']);

export const navParamsMock = createSpyObj<NavParams>(['get']);

export const zoneMock = createSpyObj<NgZone>([
  'run']);

export const authServiceMock = createSpyObj<AuthService>(['getSessionData']);

export const commonUtilServiceMock = createSpyObj<CommonUtilService>([
  'translateMessage', 'showMessage', 'showToast', 'getLoader'
]);

export const eventsMock = createSpyObj<Events>(['publish']);

export const contentServiceMock = createSpyObj<ContentService>(['getContentDetail', 'getLocalContents']);

export const popoverCtrlMock = createSpyObj<PopoverController>(['create', 'present']);

export const fileUtilMock = createSpyObj<FileUtil>([]);

export const platformMock = createSpyObj<Platform>(['registerBackButtonAction', 'exitApp']);

export const translateServiceMock = createSpyObj<TranslateService>(['use']);

export const socialSharingMock = createSpyObj<SocialSharing>([]);

export const shareUtilMock = createSpyObj<ShareUtil>([]);

export const buildParamServiceMock = createSpyObj<BuildParamService>(['getBuildConfigParam']);

export const appGlobalServiceMock = createSpyObj<AppGlobalService>([
  'isUserLoggedIn', 'getGuestUserInfo', 'generateConfigInteractEvent', 'openPopover', 'setEnrolledCourseList',
  'getSessionData', 'getCurrentUser', 'getNameForCodeInFramework', 'getGuestUserType'
]);

export const telemetryGeneratorServiceMock = createSpyObj<TelemetryGeneratorService>([
  'generateStartTelemetry', 'generateImpressionTelemetry', 'generateSpineLoadingTelemetry',
  'generateCancelDownloadTelemetry', 'generateInteractTelemetry', 'generateEndTelemetry',
  'generatePageViewTelemetry'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>(['showCredits',
  'getImportContentRequestBody']);

export const appVersionMock = createSpyObj<AppVersion>(['getAppName']);

export const pageAssembleServiceMock = createSpyObj<PageAssembleService>(['getPageAssemble']);

export const sunbirdQRScannerMock = createSpyObj<SunbirdQRScanner>(['startScanner']);

export const sharedPreferencesMock = createSpyObj<SharedPreferences>(['getString', 'putString']);

export const formAndFrameworkUtilServiceMock = createSpyObj<FormAndFrameworkUtilService>([
  'getCourseFilterConfig'
]);

export const loadingControllerMock = createSpyObj<LoadingController>(['create', 'present']);

export const reportServiceMock = createSpyObj<ReportService>(['getListOfReports']);
