import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NavController, IonicApp } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ToastController, LoadingController, PopoverController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { AlertController, Alert } from "ionic-angular";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { UserProfileService } from "sunbird";
import { FormExperience } from "./form.experience";
import { } from 'jasmine';
// import { AlertControllerMock, AlertMock} from 'ionic-mocks';
import {
    LoadingControllerMock, PopoverControllerMock, NavParamsMock, TranslateServiceStub, ToastControllerMockNew, AlertControllerMock,
    PlatformMock} from '../../../../test-config/mocks-ionic';



describe("FormExperience", () => {
    let comp: FormExperience;
    let fixture: ComponentFixture<FormExperience>;

    beforeEach(() => {

        const navControllerStub = {
            setRoot: () => ({})
        };

        const IonicAppMock = {
            _modalPortal: {
                getActive: () => ({
                    dismiss: () =>{}
                })
            },
            _overlayPortal: {
                getActive: () => ({
                    dismiss: () =>{}
                })
            }
        };

        // const platformStub = {
        //     registerBackButtonAction: () => ({})
        // };


        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [FormExperience],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder, UserProfileService, Platform,
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useClass: NavParamsMock },
                // { provide: Platform, useValue: PlatformMock },
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

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("ion view will enter should call registerBackButtonAction", () => {
        const platformStub = TestBed.get(Platform);
        spyOn(comp, "dismissPopup");
        spyOn(platformStub, "registerBackButtonAction");
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

    it("dismissPopup should make expected calls", () => {
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, "getActive");
        comp.dismissPopup()
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
    });

    it("changeJoiningDate should set end date", () => {
        comp.experienceForm.controls['joiningDate'].setValue("1950");
        comp.changeJoiningDate();
        expect(comp.experienceForm.controls['endDate'].value).toBe('');
    })

    it("onsSubmit to make expected calls", () => {
        comp.experienceForm.controls['jobName'].setValue("receptionist");
        spyOn(comp, "validateForm").and.returnValue(true);
        spyOn(comp, "updateExperience");
        comp.onSubmit(true);
        expect(comp.updateExperience).toHaveBeenCalled();

        comp.jobInfo.id = "10";
        comp.onSubmit(true);
    })

    it("should validate zipcode and return true", () => {
        let newDate = new Date().toJSON().slice(0, 10);
        comp.experienceForm.controls['isCurrentJob'].setValue(true);
        let formval = comp.experienceForm.value;
        
        comp.validateForm(formval);
        expect(comp.experienceForm.controls['endDate'].value).toEqual(newDate);

        comp.experienceForm.controls['isCurrentJob'].setValue('');
        let formval2 = comp.experienceForm.value;
        comp.validateForm(formval2);
        expect(comp.experienceForm.controls['isCurrentJob'].value).toBe(false);
    });

    it("should handle success scenario for updateExperience", () => {
        const userProfileService = TestBed.get(UserProfileService)
        const toasrCtrlStub  = TestBed.get(ToastController);
        const translateStub =  TestBed.get(TranslateService);
        spyOn(comp, "translateMessage");
        spyOn(userProfileService, "updateUserInfo").and.callFake((req, success, error) =>{
            success("success")
        })
        spyOn(comp, 'getToast').and.returnValue({
            present: () => {}
        });
        
        comp.updateExperience("req");
        expect(comp.getToast).toHaveBeenCalled();
        expect(comp.translateMessage).toHaveBeenCalledWith("PROFILE_UPDATE_SUCCESS");
    })

    it("should handle error scenario for updateExperience", () => {
        const userProfileService = TestBed.get(UserProfileService)
        const toasrCtrlStub  = TestBed.get(ToastController);
        const translateStub =  TestBed.get(TranslateService);
        spyOn(comp, "translateMessage");
        spyOn(userProfileService, "updateUserInfo").and.callFake((req, success, error) =>{
            error("error")
        })
        spyOn(comp, 'getToast').and.returnValue({
            present: () => {}
        });
        
        comp.updateExperience("req");
        expect(comp.getToast).toHaveBeenCalled();
        expect(comp.translateMessage).toHaveBeenCalledWith("PROFILE_UPDATE_FAILED");
    })

    it("getToast should make expected calls", () => {
        const toasrCtrlStub  = TestBed.get(ToastController);
        let msg = "testMessage";
        let getToast = comp.getToast(msg);
        expect(comp.options.message).toEqual(msg);
    });

});
