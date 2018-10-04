import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController, LoadingController, PopoverController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController, Alert } from 'ionic-angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthService } from 'sunbird';
import { UserProfileService } from 'sunbird';
import { FormAddress } from './form.address';

// import { AlertControllerMock, AlertMock} from 'ionic-mocks';
import {
    LoadingControllerMock, PopoverControllerMock, NavParamsMock, TranslateServiceStub, ToastControllerMockNew, AlertControllerMock
} from '../../../../test-config/mocks-ionic';
import { CommonUtilService } from '../../../service/common-util.service';

describe('FormAddress', () => {
    let comp: FormAddress;
    let fixture: ComponentFixture<FormAddress>;

    beforeEach(() => {
        const navControllerStub = {
            setRoot: () => ({})
        };
        const platformStub = {
            registerBackButtonAction: () => ({})
        };
        TestBed.configureTestingModule({
            imports : [TranslateModule.forRoot()],
            declarations: [ FormAddress ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                FormBuilder, UserProfileService, AuthService, CommonUtilService,
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Platform, useValue: platformStub },
                { provide: AlertController, useFactory: () => AlertControllerMock.instance()},
                // { provide: Alert, useFactory: () => AlertMock.instance()},
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance()},
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });

        fixture = TestBed.createComponent(FormAddress);
        // FormAddress.prototype.isNewForm = true;
        comp = fixture.componentInstance;
    });

    const getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    };
    // it("isNewForm should be true", () => {
    //     expect(comp.isNewForm).toBe(true);
    // });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('form invalid when empty', () => {
        console.log('comp.addressForm', comp.addressForm.valid);
        expect(comp.addressForm.valid).toBeFalsy();
    });

    it('form is invalid when required fields are not filled', () => {
        let errors = {};
        console.log('comp.addressForm', comp.addressForm);
        const addressLine1 = comp.addressForm.controls['addressLine1'];
        errors = addressLine1.errors || {};
        expect(addressLine1.valid).toBeFalsy();
        expect(errors['required']).toBeTruthy();

        addressLine1.setValue('test');
        errors = addressLine1.errors || {};
        expect(errors['required']).toBeFalsy();
    });
    it('onSubmit should make expected calls', () => {
        comp.addressForm.controls['addType'].setValue('permanent');
        spyOn(comp, 'validateForm').and.returnValue(true);
        spyOn(comp, 'updateAddress');
        comp.onSubmit(true);
        expect(comp.updateAddress).toHaveBeenCalled();

        comp.addressForm.controls['addType'].setValue('');
        comp.onSubmit(true);
        expect(comp.updateAddress).toHaveBeenCalled();

        comp.addressForm.controls['addType'].setValue('');
        comp.onSubmit(false);
        expect(comp.updateAddress).toHaveBeenCalled();
    });

    it('should validate zipcode and return true', () => {
        const zip = '123456';
        comp.addressForm.controls['zipcode'].setValue('123456');
        const formval = comp.addressForm.value;
        expect(comp.validateForm(formval)).toBe(true);
    });

    it('should validate zipcode and return false', () => {
        comp.addressForm.controls['zipcode'].setValue('abcdef');
        const formval = comp.addressForm.value;
        const commonUtilServiceStub  = TestBed.get(CommonUtilService);
        const translateStub =  TestBed.get(TranslateService);
        spyOn(translateStub, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });

        spyOn(commonUtilServiceStub, 'showToast').and.returnValue({
            present: () => {}
        });
        expect(comp.validateForm(formval)).toBe(false);
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
    });

    it('should handle success scenario for updateAddress', () => {
        const userProfileService = TestBed.get(UserProfileService);
        getLoader();
        const toasrCtrlStub  = TestBed.get(ToastController);
        const translateStub =  TestBed.get(TranslateService);
        const commonUtilServiceStub  = TestBed.get(CommonUtilService);
        spyOn(commonUtilServiceStub, 'translateMessage');
        spyOn(userProfileService, 'updateUserInfo').and.callFake((req, success, error) => {
            success('success');
        });
        spyOn(translateStub, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        spyOn(commonUtilServiceStub, 'showToast').and.returnValue({
            present: () => {}
        });
        comp.updateAddress('req');
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
        expect(commonUtilServiceStub.translateMessage).toHaveBeenCalledWith('PROFILE_UPDATE_SUCCESS');
    });

    it('should handle error scenario for updateAddress', () => {
        const userProfileService = TestBed.get(UserProfileService);
        const commonUtilServiceStub  = TestBed.get(CommonUtilService);
        getLoader();
        const toasrCtrlStub  = TestBed.get(ToastController);
        const translateStub =  TestBed.get(TranslateService);
        spyOn(commonUtilServiceStub, 'translateMessage');
        spyOn(userProfileService, 'updateUserInfo').and.callFake((req, success, error) => {
            error('error');
        });
        spyOn(translateStub, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        spyOn(commonUtilServiceStub, 'showToast').and.returnValue({
            present: () => {}
        });

        comp.updateAddress('req');
        expect(commonUtilServiceStub.showToast).toHaveBeenCalled();
        expect(commonUtilServiceStub.translateMessage).toHaveBeenCalledWith('PROFILE_UPDATE_FAILED');
    });


    it('getLoader makes expected calls', () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
        expect(loadingController.create).toHaveBeenCalled();
    });

    it('showDeleteConfirm should make expected calls', () => {
        const alertController = TestBed.get(AlertController);
        // const alert = TestBed.get(Alert);
        const translateStub =  TestBed.get(TranslateService);
        const platformStub: Platform = TestBed.get(Platform);
        const commonUtilServiceStub  = TestBed.get(CommonUtilService);
        spyOn(platformStub, 'registerBackButtonAction');
        spyOn(commonUtilServiceStub, 'translateMessage');
        spyOn(translateStub, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        comp.showDeleteConfirm();
        expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
        expect(alertController.create).toHaveBeenCalled();
    });

});
