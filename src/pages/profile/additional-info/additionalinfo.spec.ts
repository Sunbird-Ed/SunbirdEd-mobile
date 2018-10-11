import { mockResponse } from './additional-info-data.spec';
import { BuildParamService } from 'sunbird';
import { ServiceProvider } from 'sunbird';
import { FormAndFrameworkUtilService } from './../formandframeworkutil.service';
import { IonicAppMock } from './../../../../test-config/mocks-ionic';
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
                { provide: Platform, useValue: platformStub },
                { provide: ProfileService, useClass: ProfileServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ContainerService, useValue: ContainerServiceMock },
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: FrameworkService, useValue: frameWorkServiceStub },
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
        const TranslateServiceStub = TestBed.get(TranslateService);
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
});
