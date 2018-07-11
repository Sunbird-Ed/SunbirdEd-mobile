import { CourseUtilService } from './../src/service/course-util.service';
import { AppGlobalService } from './../src/service/app-global.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService, ContainerService, PermissionService, TelemetryService, GenieSDKServiceProvider } from "sunbird";
import { ImageLoaderConfig } from "ionic-image-loader";
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

declare let readJSON: any;

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
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
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
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
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
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

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): any {
    return;
  }

}

export class DeepLinkerMock { }

export class AuthServiceMock extends AuthService {
  public getSessionData(successCallback: any): void { }
}

export class ContainerServiceMock extends ContainerService {
}
export class PermissionServiceMock extends PermissionService {
  public requestPermission() {
    return;
  }
}
export class ImageLoaderConfigMock extends ImageLoaderConfig {
  public enableDebugMode() {
    return true;
  }
  public setMaximumCacheSize(limit: number) {
    return;
  }
}

export class TelemetryServiceMock extends TelemetryService { }

export class AppGlobalServiceMock extends AppGlobalService { }

export class CourseUtilServiceMock extends CourseUtilService { }

export class TranslateServiceStub {
  public get(key: any): any {
    Observable.of(key);
  }
}

export class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang == "mr") {
      let ru = readJSON('assets/i18n/mr.json');
      return Observable.of(ru);
    }
    let en = readJSON('assets/i18n/en.json');
    return Observable.of(en);
  }
}


export class NavParamsMock {
  data = {
  };

  get(param) {
    return this.data[param] ? this.data[param] : this.data;
  }
}

export class GenieSDKServiceProviderMock extends GenieSDKServiceProvider {
  GenieSDK = {};
  getSharedPreference() {
    return (<any>window).GenieSDK['preferences'];
  }
}

export class SharedPreferencesMock {
  getString(value) {
    return ''
  }
}

export class FileUtilMock { 
  internalStoragePath() {
    return '';
  }
 }

export class NavControllerMock { }

export class SocialSharingMock { 
  share(message, subject, file, url) {
    return '';
  }
}

export class ViewControllerMock {}

export class ToastControllerMock {}

export class StorageMock {}