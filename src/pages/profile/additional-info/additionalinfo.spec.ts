import { mockResponse } from './additional-info-data.spec';
import { BuildParamService } from 'sunbird';
import { ServiceProvider } from 'sunbird';
import { FormAndFrameworkUtilService } from './../formandframeworkutil.service';
import { IonicAppMock, PlatformMock } from './../../../../test-config/mocks-ionic';
import { SharedPreferences, ContainerService } from 'sunbird';
import {
    LoadingControllerMock, ToastControllerMockNew,
    NavMock, NavParamsMock, ProfileServiceMock,
    SharedPreferencesMock, FormAndFrameworkUtilServiceMock, ContainerServiceMock
} from '../../../../test-config/mocks-ionic';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalInfoComponent } from './additional-info';
import { TranslateService } from '@ngx-translate/core';
import {
    Component,
    NgZone
} from '@angular/core';
import {
    FormBuilder
} from '@angular/forms';
import {
    NavController,
    NavParams,
    ToastController,
    LoadingController,
    IonicApp,
    Platform
} from 'ionic-angular';
import {
    UserProfileService,
    AuthService,
    FrameworkService,
    ProfileService
} from 'sunbird';
import { CommonUtilService } from '../../../service/common-util.service';

describe('AdditionalInfoComponent', () => {
    let comp: AdditionalInfoComponent;
    let fixture: ComponentFixture<AdditionalInfoComponent>;

    beforeEach(() => {

        const IonicAppMock = {
            _modalPortal: {
                getActive: () => ({
                    dismiss: () => {}
                })
            },
            _overlayPortal: {
                getActive: () => ({
                    dismiss: () => {}
                })
            }
        };

        const platformStub = {
            registerBackButtonAction: () => ({})
        };

        const frameWorkServiceStub = {
            getCategoryData: () => ({})
        };


        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AdditionalInfoComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder, UserProfileService, AuthService,
                FrameworkService, ServiceProvider, FormBuilder, BuildParamService, CommonUtilService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: Platform, useClass: PlatformMock },
                { provide: ProfileService, useClass: ProfileServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ContainerService, useValue: ContainerServiceMock },
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: FrameworkService , useValue: frameWorkServiceStub},
                { provide: IonicApp, useValue: IonicAppMock },
                // { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                // { provide: App, useValue: appStub },
                // { provide: AppGlobalService, useValue: appGlobalServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });
        const translate = TestBed.get(TranslateService);
        const frameworkService = TestBed.get(FrameworkService);
        spyOn(frameworkService, 'getCategoryData').and.returnValue(Promise.resolve(JSON.stringify(mockResponse.categoryData)));
        fixture = TestBed.createComponent(AdditionalInfoComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    it('#validateForm should validate firstname and language', () => {
        const toastCtrlStub = TestBed.get(ToastController);
        const commonUtilService = TestBed.get(CommonUtilService);
        // const TranslateServiceStub = TestBed.get(TranslateService);
        spyOn(commonUtilService, 'showToast');
        const firstName = comp.additionalInfoForm.controls['firstName'];
        firstName.setValue('sample_firstname');
        comp.additionalInfoForm.controls['language'].setValue('english');
        let formVal = comp.additionalInfoForm.value;
        // spyOn(commonUtilService, 'showToast').and.returnValue({
        //     present: () => { }
        // });
        // spyOn(TranslateServiceStub, 'get').and.callFake((arg) => {
        //     return Observable.of('Cancel');
        // });
        expect(comp.validateForm(formVal)).toBe(true);

        firstName.setValue('');
        comp.additionalInfoForm.controls['language'].setValue('english');
        formVal = comp.additionalInfoForm.value;
        expect(comp.validateForm(formVal)).toBe(false);

        firstName.setValue('sample-first-name');
        comp.additionalInfoForm.controls['language'].setValue('');
        formVal = comp.additionalInfoForm.value;
        expect(comp.validateForm(formVal)).toBe(false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_EMPTY_LANGUAGE');


    });

    it('#ionViewWillEnter should make expected call', () => {
        const platformStub = TestBed.get(Platform);
        spyOn(platformStub, 'registerBackButtonAction').and.callFake((fun: Function, num) => {
            return fun();
        });
        comp.ionViewWillEnter();
    });
    it('#ionViewWillLeave should make expected call', () => {
        comp.unregisterBackButton = spyOn(comp, 'ionViewWillEnter');
        comp.ionViewWillLeave();
        expect(comp.unregisterBackButton).toHaveBeenCalled();
    });
    it('#dismissPopup should make expected calls while activePortal is true', () => {
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, 'getActive');
        comp.dismissPopup();
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
    });
    it('#dismissPopup should make expected calls while activePortal is false', () => {
        const ionicApp = TestBed.get(IonicApp);
        const navControllerStub = TestBed.get(NavController);
        spyOn(ionicApp._modalPortal, 'getActive').and.returnValue(false);
        spyOn(ionicApp._overlayPortal, 'getActive').and.returnValue(false);
        spyOn(navControllerStub, 'pop').and.returnValue(Promise.resolve());
        comp.dismissPopup();
        expect(navControllerStub.pop).toHaveBeenCalled();
    });
     it('#toggleLock should make expected calls', () => {
        const field = 'private';
        const fieldDisplayName = 'test';
        const revert = true;
        spyOn(comp, 'toggleLock').and.callThrough();
        comp.toggleLock(field, fieldDisplayName, revert);
        expect(comp.toggleLock).toHaveBeenCalledWith(field, fieldDisplayName, revert);
    });
    it('#toggleLock should make expected calls with details', () => {
        const field = 'private';
        const fieldDisplayName = 'test';
        const profileVisibility = [];
        comp.profileVisibility[field] = 'private';
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(comp, 'toggleLock').and.callThrough();
        spyOn(commonUtilServiceStub, 'showToast');
        spyOn(commonUtilServiceStub, 'translateMessage').and.returnValue('testing');
        spyOn(comp, 'setProfileVisibility');
        comp.toggleLock(field, fieldDisplayName, false);
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
        expect(commonUtilServiceStub.translateMessage);
        expect(comp.setProfileVisibility).toHaveBeenCalledWith(field);
    });

});
