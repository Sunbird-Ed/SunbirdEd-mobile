import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { CommonUtilService, AppGlobalService, AppHeaderService, TelemetryGeneratorService } from '@app/service';
import { PageId, Environment, InteractType, InteractSubtype } from '../../service/telemetry-constants';
import { SunbirdQRScanner } from '../qrscanner';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { TabsPage } from '../tabs/tabs';
import { AndroidPermissionsService } from '@app/service/android-permissions/android-permissions.service';
import { AndroidPermission, AndroidPermissionsStatus } from '@app/service/android-permissions/android-permission';
import { Observable } from 'rxjs';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})
export class PermissionPage {

  appName = '';
  permissionListDetails = [
    {
      title: this.commonUtilService.translateMessage('CAMERA'),
      path: './assets/imgs/ic_photo_camera.png',
      description: this.commonUtilService.translateMessage('CAMERA_PERMISSION_DESCRIPTION', this.appName)
    },
    {
      title: this.commonUtilService.translateMessage('FILE_MANAGER'),
      path: './assets/imgs/ic_folder_open.png',
      description: this.commonUtilService.translateMessage('FILE_MANAGER_PERMISSION_DESCRIPTION')
    },
    {
      title: this.commonUtilService.translateMessage('MICROPHONE'),
      path: './assets/imgs/ic_keyboard_voice.png',
      description: this.commonUtilService.translateMessage('MICROPHONE_PERMISSION_DESCRIPTION')
    }
  ];

  readonly permissionList = [
    AndroidPermission.WRITE_EXTERNAL_STORAGE,
    AndroidPermission.RECORD_AUDIO,
    AndroidPermission.CAMERA];

  changePermissionAccess = false;
  showScannerPage = false;
  showProfileSettingPage = false;
  showTabsPage = false;
  headerObservable: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonUtilService: CommonUtilService,
    private scannerService: SunbirdQRScanner,
    private permission: AndroidPermissionsService,
    private appGlobalService: AppGlobalService,
    private headerService: AppHeaderService,
    private event: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private appVersion: AppVersion) {
    this.appVersion.getAppName()
      .then((appName: any) => this.appName = appName);
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad PermissionPage');
    }

    ionViewWillEnter() {
      this.showScannerPage = Boolean(this.navParams.get('showScannerPage'));
      this.showProfileSettingPage = Boolean(this.navParams.get('showProfileSettingPage'));
      this.showTabsPage = Boolean(this.navParams.get('showTabsPage'));
      this.headerService.showHeaderWithBackButton();

      this.event.subscribe('event:showScanner', (data) => {
        if (data.pageName === PageId.PERMISSION) {
          this.scannerService.startScanner(PageId.PERMISSION, true);
        }
      });

      this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
        this.handleHeaderEvents(eventName);
      });
    }

    grantAccess() {
      this.generateInteractEvent(true);
      // If user given camera access and the showScannerPage is ON
      this.requestAppPermissions().then((status) => {
        // Check if scannerpage is ON and user given permission to camera then open scanner page
        if (this.showScannerPage) {
          if (status && status.hasPermission) {
            this.scannerService.startScanner(PageId.PERMISSION, true);
          } else {
            this.permission.checkPermissions([AndroidPermission.CAMERA]).toPromise().then((cameraStatus) => {
              console.log("cameraStatus", cameraStatus);

              if (cameraStatus && cameraStatus['android.permission.CAMERA'] && cameraStatus['android.permission.CAMERA'].hasPermission) {
                this.scannerService.startScanner(PageId.PERMISSION, true);
              } else if (this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
                this.navCtrl.push(ProfileSettingsPage);
              } else {
                this.navCtrl.push(TabsPage, { loginMode: 'guest' });
              }
            });
          }
        } else if (this.showProfileSettingPage) {
          // check if profileSetting page config. is ON
          this.navCtrl.push(ProfileSettingsPage);
        } else {
          this.navCtrl.push(TabsPage, { loginMode: 'guest' });
        }
      });
    }

    skipAccess() {
      this.generateInteractEvent(false);
      if (this.showProfileSettingPage || this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
        this.navCtrl.push(ProfileSettingsPage);
      } else if (this.showScannerPage) {
        this.permission.checkPermissions([AndroidPermission.CAMERA]).toPromise().then((cameraStatus) => {
          console.log("cameraStatus", cameraStatus);
          if (cameraStatus && cameraStatus['android.permission.CAMERA'] && cameraStatus['android.permission.CAMERA'].hasPermission) {
            this.scannerService.startScanner(PageId.PERMISSION, true);
          }
        });
      } else {
        this.navCtrl.push(TabsPage, {
          loginMode: 'guest'
        });
      }
    }

  private async requestAppPermissions() {
    return this.permission.checkPermissions(this.permissionList)
      .mergeMap((statusMap: { [key: string]: AndroidPermissionsStatus }) => {
        const toRequest: AndroidPermission[] = [];

        for (const permission in statusMap) {
          if (!statusMap[permission].hasPermission) {
            toRequest.push(permission as AndroidPermission);
          }
        }

        if (!toRequest.length) {
          return Observable.of(undefined);
        }

        return this.permission.requestPermissions(toRequest);
      }).toPromise();
  }

  checkPermission(requiredPermissionList): Promise<any> {
    return this.permission.checkPermissions(requiredPermissionList)
      .mergeMap((statusMap: { [key: string]: AndroidPermissionsStatus }) => {
        const toRequest: AndroidPermission[] = [];

        for (const permission in statusMap) {
          if (!statusMap[permission].hasPermission) {
            toRequest.push(permission as AndroidPermission);
          }
        }

        if (!toRequest.length) {
          return Observable.of({ hasPermission: true });
        }

        return this.permission.requestPermissions(toRequest);
      }).toPromise();
  }

  handleHeaderEvents($event) {
    if ($event.name === 'back') {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.PERMISSION, Environment.ONBOARDING, true);
    }
  }

  generateInteractEvent(permissionAllowed: boolean) {
    const values = new Map();
    values['permissionAllowed'] = permissionAllowed;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      (permissionAllowed) ? InteractSubtype.GRANT_ACCESS_CLICKED : InteractSubtype.SKIP_CLICKED,
      Environment.ONBOARDING,
      PageId.PERMISSION,
      undefined,
      values);
  }
}
