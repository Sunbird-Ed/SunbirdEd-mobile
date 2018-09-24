import { CourseUtilService } from "./../src/service/course-util.service";
import { AppGlobalService } from "./../src/service/app-global.service";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import {
  AuthService,
  ContainerService,
  PermissionService,
  TelemetryService,
  GenieSDKServiceProvider,
  SharedPreferences,
  ShareUtil,
  ContentService,
  ContentFeedback
} from "sunbird";
import { ImageLoaderConfig } from "ionic-image-loader";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { App, ViewController } from "ionic-angular";
import { ElementRef } from "@angular/core";
import { CommonUtilService } from "../src/service/common-util.service";
import { resolve } from "q";
import { NavParams } from "ionic-angular";

declare let readJSON: any;

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise(resolve => {
      resolve("READY");
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return fn();
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: "10",
      paddingTop: "10",
      paddingRight: "10",
      paddingBottom: "10"
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(
    ele: any,
    eventName: string,
    callback: any
  ): Function {
    return () => true;
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document["activeElement"];
  }

  public exitApp(): any {
    return;
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault: () => {};
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
  onDeepLink() {
    return;
  }
}

export class NavMock {
  public pop(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public popTo(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getByIndex(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      instance: {
        model: "something"
      }
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): any {
    return;
  }

  public length(): any {
    return;
  }

  public insert(): any {
    return;
  }
}

export class DeepLinkerMock { }

export class AuthServiceMock extends AuthService {
  public getSessionData(successCallback: any): void { }
  public endSession: () => {};
}

export class ContainerServiceMock extends ContainerService {
  public removeAllTabs: () => {};
}
export class PermissionServiceMock extends PermissionService {
  //public requestPermission: () => ({});
}
export class ImageLoaderConfigMock extends ImageLoaderConfig {
  public enableDebugMode() {
    return true;
  }
  public setMaximumCacheSize(limit: number) {
    return;
  }
}

export class TelemetryServiceMock extends TelemetryService {
  end: () => {};
  interact: (interact) => {};
  impression: (impression) => {};
  sync: (successCallback, errorCallback) => {};
  getTelemetryStat: (sucess, error) => {};
}
export class ContentServiceMock {
  public sendFeedback: (request, successCallback, errorCallback) => {};
}

export class AppGlobalServiceMock extends AppGlobalService {
  static isGuestUser: boolean;
  public DISPLAY_ONBOARDING_PAGE: boolean;
  static session: any;
  static DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER: boolean;
  static DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT: boolean;
  isUserLoggedIn(): boolean {
    return AppGlobalServiceMock.isGuestUser;
  }
  getSessionData(): any {
    return AppGlobalServiceMock.session;
  }

  getGuestUserType(): any {
    return "TEACHER";
  }

  generateConfigInteractEvent: () => {};

  static setLoggedInStatus(status: boolean) {
    AppGlobalServiceMock.isGuestUser = status;
  }

  static setSessionData(session: any) {
    AppGlobalServiceMock.session = session;
  }
}

export class EventsMock {
  subscribe() {
    return;
  }
  publish() {

  }
}
export class CourseUtilServiceMock extends CourseUtilService { }

export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
  use: () => {};
  currentLang: 'en'
  // get: () => ({
  //     subscribe: () => ({})
  // })
}

export class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang == "mr") {
      let ru = readJSON("assets/i18n/mr.json");
      return Observable.of(ru);
    }
    let en = readJSON("assets/i18n/en.json");
    return Observable.of(en);
  }
}

export class NavParamsMock {
  data = {};

  get(param) {
    return this.data[param] ? this.data[param] : this.data;
  }

  static setData(data) {
    data = data;
  }
}

export class GenieSDKServiceProviderMock extends GenieSDKServiceProvider {
  GenieSDK = {
    genieSdkUtil: {}
  };
  getSharedPreference() {
    return (<any>window).GenieSDK["preferences"];
  }
}

export class SharedPreferencesMock {
  public getString(): Promise<string> {
    return new Promise(resolve => {
      resolve("value");
    });
  }
  public putString() { }
}

export class FileUtilMock {
  internalStoragePath() {
    return "";
  }
}
export class ShareUtilMock extends ShareUtil {
  exportTelemetry: (successCallback, errorCallback) => {};
  exportApk: (SuccessCallback, errorCallback) => {};
}
export class NavControllerMock { }

export class SocialSharingMock {
  share(message, subject, file, url) {
    return "";
  }
  shareViaEmail(message, subject, to, cc, bcc, file) {
    return "";
  }
}

export class ViewControllerMock {
  public dismiss(): Promise<any> {
    return new Promise(resolve => {
      resolve("success");
    });
  }
}

// export class ToastControllerMock {
//   create: () => ({
//     present: () => ({})
//   })
// }

export class StorageMock { }

export class AppVersionMock {
  getAppName(): Promise<string> {
    return new Promise(resolve => {
      resolve("value");
    });
  }
}

export class FormAndFrameworkUtilServiceMock {
  public checkNewAppVersion(): Promise<string> {
    return new Promise(resolve => {
      resolve("");
    });
  }

  public getSyllabusList = () => ({});

  public getFrameworkDetails = () => ({});

  public getCategoryData = () => ({});

  // public getFrameworkDetails(): Promise<string> {
  //   return new Promise;
  // }
}

export class profileServiceMock {
  getCurrentUser(res, err) {
    return res({});
  }
  setCurrentUser(res, err) {
    return res({});
  }
  // getCurrentUser(res, err): Promise<any> {
  //   return new Promise(resolve => {
  //     resolve();
  //   });
  // };
  updateProfile(req, res, err) {
    return res({});
  }
  createProfile(req, res, err) {
    return res({});
  }
  getAllUserProfile(res, err) {
    return res({});
  }

}

export class groupServiceMock {
  deleteGroup: () => ({
    then: () => ({
      catch: () => ({})
    })
  });
  public setCurrentGroup(): Promise<string> {
    return new Promise(resolve => {
      resolve();
    });
  }
  public addUpdateProfilesToGroup(): Promise<string> {
    return new Promise(resolve => {
      resolve();
    });
  }
//   (res, err) {
//     return res({});
//  }
}

export class eventsMock {
  publish: () => {};
}

export class oAuthServiceMock {
  doLogOut(): Promise<any> {
    return new Promise(resolve => {
      resolve();
    });
  };
};

export class networkMock {
  type: {}
};

export class MockElementRef implements ElementRef {
  nativeElement = {};
}

export class appMock extends App {
  _getPortal(): any {
    return {};
  }
  getRootNav: () => {
    setRoot: () => {};
  };
}

export class AppMock {
  public getActiveNav(): [NavMock] {
    return [new NavMock()];
  }
  public getActiveNavs(): [NavMock] {
    return [new NavMock()];
  }

  public getRootNav(): AnyNav {
    return new AnyNav();
  }
}

export class AnyNav {
  public setRoot(): any {
    return {};
  }
}

export class NavControllerBase { }

export class ToastControllerMock {
  _getPortal(): any {
    return {};
  }
  create(options?: any) {
    return new ToastMock();
  }
}

class ToastMock extends ViewController {
  present() { }
  dismissAll() { }
  onDidDismiss() { }
}

export class ToastMockNew {
  public static instance(): any {
    const instance: any = jasmine.createSpyObj("Toast", [
      "present",
      "dismissAll",
      "onDidDismiss",
      "setContent",
      "setSpinner"
    ]);
    instance.present.and.returnValue(Promise.resolve());
    return instance;
  }
}

export class ToastControllerMockNew {
  public static instance(toast?: ToastMock): any {
    const instance: any = jasmine.createSpyObj("ToastController", ["create"]);
    instance.create.and.returnValue(toast || ToastMockNew.instance());
    return instance;
  }
}
export class LoadingMock extends ViewController {
  public static instance(): any {
    let instance = jasmine.createSpyObj("Loading", [
      "present",
      "dismiss",
      "onDidDismiss",
      "dismissAll",
      "setContent",
      "setSpinner"
    ]);
    instance.present.and.returnValue(Promise.resolve());
    instance.dismiss.and.returnValue(Promise.resolve());
    // instance.onDidDismiss.and.returnValue(Promise.resolve());
    return instance;
  }
}
export class LoadingControllerMock {
  public static instance(loading?: LoadingMock): any {
    let instance = jasmine.createSpyObj("LoadingController", ["create"]);
    instance.create.and.returnValue(loading || LoadingMock.instance());

    return instance;
  }
}

export class PopoverControllerMock {
  public static instance(popOver?: PopoverMock): any {
    let instance = jasmine.createSpyObj('LoadingController', ['create', 'onDidDismiss', 'present']);
    instance.create.and.returnValue(popOver || PopoverMock.instance());
    return instance;
  }

}

export class PopoverMock extends ViewController {
  public static onDismissResponse = {};
  public static instance(): any {
    let instance = jasmine.createSpyObj("Loading", [
      "present",
      "onDidDismiss",
      "dismissAll",
      "setContent",
      "setSpinner",
      "create"
    ]);
    instance.present.and.returnValue(Promise.resolve());
    instance.onDidDismiss.and.callFake((success) => {
      return success(this.onDismissResponse)
    });
    return instance;
  }

  public static setOnDissMissResponse(response) {
    PopoverMock.onDismissResponse = response;
  }

}

export class AlertControllerMock {
  public static instance(alert?: AlertMock): any {
    let instance = jasmine.createSpyObj("AlertController", ["create"]);
    instance.create.and.returnValue(alert || AlertMock.instance());

    return instance;
  }
}

export class AlertMock extends ViewController {
  public static instance(): any {
    let instance = jasmine.createSpyObj("Alert", [
      "present",
      "onDidDismiss",
      "dismissAll",
      "setContent",
      "setSpinner"
    ]);
    instance.present.and.returnValue(Promise.resolve());
    return instance;
  }
}
// class PopoverMock {

//   constructor(popoverMock: PopoverMock) {}

//   public present(): void {}

//   public onDismiss(): void {}

//   public onDidDismiss(): void {}

// }

// export class PopoverControllerMock {

//   public create(popoverMock: PopoverMock): PopoverMock {
//     return new PopoverMock(popoverMock);
//   }
// }

class LoadingMockNew {
  private content: string;

  constructor(loadingMock: LoadingMockNew) {
    this.content = loadingMock.content;
  }

  public present(): void {
    console.debug("LoadingMock : present -> " + this.content);
  }

  public dismiss(): void {
    console.debug("LoadingMock : dismiss");
  }

  public onDidDismiss(): void {
    console.debug("LoadingMock : onDidDismiss");
  }
}

export class LoadingControllerMockNew {
  public create(loadingMock: LoadingMockNew): LoadingMockNew {
    return new LoadingMockNew(loadingMock);
  }
}

export class CommonUtilServiceMock extends CommonUtilService { }

export class BuildParamaServiceMock {
  public getBuildConfigParam(): Promise<string> {
    return new Promise(resolve => {
      resolve();
    });
  }
}

export class IonicAppMock {
  public _modalPortal: {
    getActive: () => {
      dismiss: () => {};
    };
  };
  public _overlayPortal: {
    getActive: () => {
      dismiss: () => {};
    };
  };
}
export class ngZone {
  run: () => {};
}

export class NavbarMock {
  // public backButtonClick: Function;

  public backButtonClick() {
    return {};
  }

}
export class OAuthServiceMock {
  doOAuthStepOne: () => {};
  doOAuthStepTwo: () => {};
}

export class NavParamsMockNew {
  static returnParams: any = {};

  public get(key): any {
    if (NavParamsMockNew.returnParams[key]) {
      return NavParamsMockNew.returnParams[key];
    }
    return undefined;
  }

  static setParams(key, value) {
    NavParamsMockNew.returnParams[key] = value;
  }
}


