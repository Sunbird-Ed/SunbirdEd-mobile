import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonUtilService, AppGlobalService } from '@app/service';
import { PageId } from '../../service/telemetry-constants';
import { SunbirdQRScanner } from '../qrscanner';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { TabsPage } from '../tabs/tabs';
import { AndroidPermissionsService } from '@app/service/android-permissions/android-permissions.service';
import { AndroidPermission, AndroidPermissionsStatus } from '@app/service/android-permissions/android-permission';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})
export class PermissionPage {

  permissionListDetails = [
    {
      title: this.commonUtilService.translateMessage('CAMERA'),
      icon: 'camera',
      description: this.commonUtilService.translateMessage('CAMERA_PERMISSION_DESCRIPTION')
    },
    {
      title: this.commonUtilService.translateMessage('FILE_MANAGER'),
      icon: 'folder-open',
      description: this.commonUtilService.translateMessage('FILE_MANAGER_PERMISSION_DESCRIPTION')
    },
    {
      title: this.commonUtilService.translateMessage('MICROPHONE'),
      icon: 'mic',
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public commonUtilService: CommonUtilService,
    private scannerService: SunbirdQRScanner,
    private permission: AndroidPermissionsService,
    private appGlobalService: AppGlobalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PermissionPage');
  }

  ionViewWillEnter() {
    this.showScannerPage = Boolean(this.navParams.get('showScannerPage'));
    this.showProfileSettingPage = Boolean(this.navParams.get('showProfileSettingPage'));
    this.showTabsPage = Boolean(this.navParams.get('showTabsPage'));
  }

  grantAccess() {
    // If user given camera access and the showScannerPage is ON
    this.requestAppPermissions().then((status) => {
      // Check if scannerpage is ON and user given permission to camera then open scanner page
      if (this.showScannerPage) {
        if (status && status.hasPermission) {
          this.scannerService.startScanner(PageId.USER_TYPE_SELECTION, true);
        } else {
          this.permission.checkPermissions([AndroidPermission.CAMERA]).toPromise().then((cameraStatus) => {
            console.log("cameraStatus", cameraStatus);
            
            if (cameraStatus && cameraStatus.hasPermission) {
              this.scannerService.startScanner(PageId.USER_TYPE_SELECTION, true);
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
    if (this.showProfileSettingPage) {
      this.navCtrl.push(ProfileSettingsPage);
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

}
