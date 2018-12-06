import {AuthService, BuildParamService, ContentService, CourseService, FileUtil, ShareUtil, ReportService} from 'sunbird';
import {Events, NavController, NavParams, Platform, PopoverController, LoadingController} from 'ionic-angular';
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

export const eventsMock = createSpyObj<Events>(['publish']);

export const contentServiceMock = createSpyObj<ContentService>(['getContentDetail', 'getLocalContents']);

export const popoverCtrlMock = createSpyObj<PopoverController>([]);

export const fileUtilMock = createSpyObj<FileUtil>([]);

export const platformMock = createSpyObj<Platform>([]);

export const translateServiceMock = createSpyObj<TranslateService>([]);

export const socialSharingMock = createSpyObj<SocialSharing>([]);

export const shareUtilMock = createSpyObj<ShareUtil>([]);

export const buildParamServiceMock = createSpyObj<BuildParamService>(['getBuildConfigParam']);

export const appGlobalServiceMock = createSpyObj<AppGlobalService>([
  'isUserLoggedIn', 'getGuestUserInfo'
]);

export const telemetryGeneratorServiceMock = createSpyObj<TelemetryGeneratorService>([
  'generateStartTelemetry', 'generateImpressionTelemetry', 'generateInteractTelemetry'
]);

export const courseUtilServiceMock = createSpyObj<CourseUtilService>([]);

export const loadingControllerMock = createSpyObj<LoadingController>(['create', 'present']);

export const reportServiceMock = createSpyObj<ReportService>(['getListOfReports']);
