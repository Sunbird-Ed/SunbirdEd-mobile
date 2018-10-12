import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, IonicApp } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController, LoadingController, PopoverController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController, Alert } from 'ionic-angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UserProfileService, SharedPreferences, ServiceProvider } from 'sunbird';
import { FormExperience } from './form.experience';
import { } from 'jasmine';
// import { AlertControllerMock, AlertMock} from 'ionic-mocks';
import {
    LoadingControllerMock, PopoverControllerMock, NavParamsMock, TranslateServiceStub, ToastControllerMockNew, AlertControllerMock,
    PlatformMock, NavMock
} from '../../../../test-config/mocks-ionic';
import { CommonUtilService } from '../../../service/common-util.service';
import { Events } from 'ionic-angular';



describe('FormExperience', () => {
    let comp: FormExperience;
    let fixture: ComponentFixture<FormExperience>;

    beforeEach(() => {

        const IonicAppMock = {
            _modalPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
            _overlayPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            }
        };

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [FormExperience],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder, UserProfileService, Platform, CommonUtilService,
                SharedPreferences, ServiceProvider, Events,
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(FormExperience);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('ion view will enter should call registerBackButtonAction', () => {
        const platformStub = TestBed.get(Platform);
        spyOn(comp, 'dismissPopup');
        spyOn(platformStub, 'registerBackButtonAction');
        comp.ionViewWillEnter();
        // expect(comp.dismissPopup).toHaveBeenCalled();
        expect(platformStub.registerBackButtonAction).toHaveBeenCalled();

    });

    // it("ionViewWillLeave shoulcall unregisterBackButton", () => {
    //     const platformStub = TestBed.get(Platform);
    //     spyOn(comp, "unregisterBackButton");
    //     comp.unregisterBackButton = platformStub.registerBackButtonAction();
    //     comp.ionViewWillLeave();
    //     expect(comp.unregisterBackButton).toHaveBeenCalled();
    // });

    it('dismissPopup should make expected calls', () => {
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, 'getActive');
        comp.dismissPopup();
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
    });

    it('changeJoiningDate should set end date', () => {
        comp.experienceForm.controls['joiningDate'].setValue('1950');
        comp.changeJoiningDate();
        expect(comp.experienceForm.controls['endDate'].value).toBe('');
    });

    it('onsSubmit to make expected calls', () => {
        comp.experienceForm.controls['jobName'].setValue('receptionist');
        spyOn(comp, 'validateForm').and.returnValue(true);
        spyOn(comp, 'updateExperience');
        comp.onSubmit(true);
        expect(comp.updateExperience).toHaveBeenCalled();

        comp.jobInfo.id = '10';
        comp.onSubmit(true);
    });

    it('should validate zipcode and return true', () => {
        const newDate = new Date().toJSON().slice(0, 10);
        comp.experienceForm.controls['isCurrentJob'].setValue(true);
        const formval = comp.experienceForm.value;
        comp.validateForm(formval);
        expect(comp.experienceForm.controls['endDate'].value).toEqual(newDate);

        comp.experienceForm.controls['isCurrentJob'].setValue('');
        const formval2 = comp.experienceForm.value;
        comp.validateForm(formval2);
        expect(comp.experienceForm.controls['isCurrentJob'].value).toBe(false);
    });

    it('should handle success scenario for updateExperience', () => {
        const userProfileService = TestBed.get(UserProfileService);
        const toasrCtrlStub = TestBed.get(ToastController);
        const translateStub = TestBed.get(TranslateService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(commonUtilServiceStub, 'translateMessage');
        spyOn(userProfileService, 'updateUserInfo').and.callFake((req, success, error) => {
            success('success');
        });
        spyOn(commonUtilServiceStub, 'showToast').and.returnValue({
            present: () => { }
        });

        comp.updateExperience('req');
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
        expect(commonUtilServiceStub.translateMessage).toHaveBeenCalledWith('PROFILE_UPDATE_SUCCESS');
    });

    it('should handle error scenario for updateExperience', () => {
        const userProfileService = TestBed.get(UserProfileService);
        const toasrCtrlStub = TestBed.get(ToastController);
        const translateStub = TestBed.get(TranslateService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(commonUtilServiceStub, 'translateMessage');
        spyOn(userProfileService, 'updateUserInfo').and.callFake((req, success, error) => {
            error('error');
        });
        spyOn(commonUtilServiceStub, 'showToast').and.returnValue({
            present: () => { }
        });

        comp.updateExperience('req');
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
        expect(commonUtilServiceStub.translateMessage).toHaveBeenCalledWith('PROFILE_UPDATE_FAILED');
    });

    it('should return formated date', () => {
        const newDate = new Date('2018-06-15 10:33:21').toISOString().slice(0, 10);
        expect(comp.formatDate('2018-06-15 10:33:21')).toEqual(newDate);
    });

    it('showDeleteConfirm should make expected calls', () => {
        const alertController = TestBed.get(AlertController);
        // const alert = TestBed.get(Alert);
        const translateStub = TestBed.get(TranslateService);
        const platformStub: Platform = TestBed.get(Platform);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(platformStub, 'registerBackButtonAction');
        spyOn(commonUtilServiceStub, 'translateMessage');

        comp.showDeleteConfirm();
        expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
        expect(alertController.create).toHaveBeenCalled();
    });

});
