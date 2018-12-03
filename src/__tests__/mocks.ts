import {AuthService, BuildParamService, ContentService, CourseService, FileUtil, ShareUtil} from 'sunbird';
import {Events, NavController, NavParams, Platform, PopoverController} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {CommonUtilService, AppGlobalService, TelemetryGeneratorService, CourseUtilService} from '@app/service';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing';

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

export const eventsMock = createSpyObj<Events>(['publish', 'subscribe', 'unsubscribe']);

export const contentServiceMock = createSpyObj<ContentService>(['getContentDetail',
'cancelDownload', 'importContent', 'getChildContents']);

export const popoverCtrlMock = createSpyObj<PopoverController>(['create']);

export const fileUtilMock = createSpyObj<FileUtil>(['internalStoragePath']);

export const platformMock = createSpyObj<Platform>([]);

export const translateServiceMock = createSpyObj<TranslateService>([]);

export const socialSharingMock = createSpyObj<SocialSharing>(['share']);

export const shareUtilMock = createSpyObj<ShareUtil>(['exportEcar']);

export const buildParamServiceMock = createSpyObj<BuildParamService>(['getBuildConfigParam']);

export const appGlobalServiceMock = createSpyObj<AppGlobalService>([
  'isUserLoggedIn', 'getGuestUserInfo'
]);

export const telemetryGeneratorServiceMock = createSpyObj<TelemetryGeneratorService>([
  'generateStartTelemetry', 'generateImpressionTelemetry', 'generateSpineLoadingTelemetry',
  'generateCancelDownloadTelemetry', 'generateInteractTelemetry', 'generateEndTelemetry'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>(['showCredits']);


