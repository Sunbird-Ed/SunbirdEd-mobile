import { PermissionPage } from './permission';
import { commonUtilServiceMock,
         sunbirdQRScannerMock,
         headerServiceMock,
         appGlobalServiceMock,
         permissionServiceMock,
         eventsMock,
         telemetryGeneratorServiceMock,
         appVersionMock,
         navCtrlMock,
         navParamsMock  } from './../../__tests__/mocks';
import { AndroidPermission } from '../../service/android-permissions/android-permission';
import { Observable } from 'rxjs';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { TabsPage } from '../tabs/tabs';

describe('PageFilter component', () => {
    let pagePermission: PermissionPage;
    const permissionList = [
        AndroidPermission.WRITE_EXTERNAL_STORAGE,
        AndroidPermission.RECORD_AUDIO,
        AndroidPermission.CAMERA];

    beforeEach(() => {
        permissionServiceMock.checkPermissions.mockReturnValue(Observable.of({
            'android.permission.CAMERA': {hasPermission: false},
            'android.permission.RECORD_AUDIO': {hasPermission: false},
            'android.permission.WRITE_EXTERNAL_STORAGE': {hasPermission: false} }
            ));
            headerServiceMock.headerEventEmitted$ = Observable.from([]) as any;
        appVersionMock.getAppName.mockResolvedValue('Sunbird');
                navParamsMock.get.mockImplementation((param: string) => {
            if (param === 'changePermissionAccess') {
               return true;
            } else if ( param === 'showScannerPage') {
                return true;
            } else if (param === 'showProfileSettingPage') {
               return false;
            } else if (param === 'showTabsPage') {
                return false;
            }
    });
    pagePermission = new PermissionPage(
                    navCtrlMock as any,
                    navParamsMock as any,
                    commonUtilServiceMock as any,
                    sunbirdQRScannerMock as any,
                    permissionServiceMock as any,
                    appGlobalServiceMock as any,
                    headerServiceMock as any,
                    eventsMock as any,
                    telemetryGeneratorServiceMock as any,
                    appVersionMock as any);
    });
    it('instance testing ', () => {
        expect(pagePermission).toBeTruthy();
    });

    describe('ionViewWillEnter()', () => {
        it('ionViewWillEnter should call check permissions', () => {
            pagePermission.ionViewWillEnter();
            expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
        });
    });

    describe('grantAccess()', () => {
        it('if camera permission granted and scannerpage is ON, it should open scanner', (done) => {
            // arrange
            permissionServiceMock.requestPermissions.mockResolvedValue({hasPermission: true});
            appGlobalServiceMock.setIsPermissionAsked.mockReturnValue('');
            pagePermission.showScannerPage = true;
            // act
            pagePermission.grantAccess();
            setTimeout(() => {
                // assert
                expect(sunbirdQRScannerMock.startScanner).toHaveBeenCalled();
                done();
            }, 0);
            expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
        });

        // tslint:disable-next-line:max-line-length
        it('if camera permission not granted and DISPLAY_ONBOARDING_CATEGORY_PAGE is true, it should show ProfileSettingsPage', (done) => {
           // arrange
           (appGlobalServiceMock.DISPLAY_ONBOARDING_CATEGORY_PAGE as any) = true;
           permissionServiceMock.requestPermissions.mockResolvedValue({hasPermission: false});
           appGlobalServiceMock.setIsPermissionAsked.mockReturnValue('');
           pagePermission.showScannerPage = true;
           // act
           pagePermission.grantAccess();
           setTimeout(() => {
               // assert
               expect(navCtrlMock.push).toHaveBeenCalledWith(ProfileSettingsPage);
               done();
           }, 0);
           expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
        });

        it('if camera permission not granted and DISPLAY_ONBOARDING_CATEGORY_PAGE is false, it should show TabsPage', (done) => {
            // arrange
            (appGlobalServiceMock.DISPLAY_ONBOARDING_CATEGORY_PAGE as any) = false;
            permissionServiceMock.requestPermissions.mockResolvedValue({hasPermission: false});
            appGlobalServiceMock.setIsPermissionAsked.mockReturnValue('');
            pagePermission.showScannerPage = true;
            // act
            pagePermission.grantAccess();
            setTimeout(() => {
                // assert
                expect(navCtrlMock.push).toHaveBeenCalledWith(TabsPage, { loginMode: 'guest' });
                done();
            }, 0);
            expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
        });

        it('showScannerPage is true and  only camera permission is true, it should start scanner', (done) => {
             // arrange
             pagePermission.showScannerPage = true;
             permissionServiceMock.checkPermissions.mockReturnValue(Observable.of({
                'android.permission.CAMERA': {hasPermission: true},
                'android.permission.RECORD_AUDIO': {hasPermission: false},
                'android.permission.WRITE_EXTERNAL_STORAGE': {hasPermission: false} }
                ));
             permissionServiceMock.requestPermissions.mockResolvedValue({hasPermission: false});
             appGlobalServiceMock.setIsPermissionAsked.mockReturnValue('');
             // act
             pagePermission.grantAccess();
             setTimeout(() => {
                 // assert
                 expect(sunbirdQRScannerMock.startScanner).toHaveBeenCalled();
                 done();
             }, 0);
             expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
         });

        // it('scannerpage is Off and  profileSetting page config is Off, it should show TabsPage', () => {
        //     pagePermission.ionViewWillEnter();
        //     expect(permissionServiceMock.checkPermissions).toHaveBeenCalledWith(permissionList);
        // });

    });
});
