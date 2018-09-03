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
import { FormEducation } from "./form.education";
import { } from 'jasmine';
// import { AlertControllerMock, AlertMock} from 'ionic-mocks';
import {
    LoadingControllerMock, PopoverControllerMock, NavParamsMock, TranslateServiceStub, ToastControllerMockNew, AlertControllerMock,
    PlatformMock} from '../../../../test-config/mocks-ionic';



describe("FormEducation", () => {
    let comp: FormEducation;
    let fixture: ComponentFixture<FormEducation>;

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
            declarations: [FormEducation],
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
        fixture = TestBed.createComponent(FormEducation);
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

    it("dismissPopup should make expected calls", () => {
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, "getActive");
        comp.dismissPopup()
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
    });

    it("onSubmit to make expected calls", () => {
        comp.educationForm.controls['degree'].setValue("BE");
        spyOn(comp, "validateForm").and.returnValue(true);
        spyOn(comp, "updateEducation");
        comp.onSubmit(true);
        expect(comp.updateEducation).toHaveBeenCalled();

        comp.formDetails.id = "10";
        comp.onSubmit(true);
    })

    it("validateForm should return true", () => {
        comp.educationForm.controls['percentage'].setValue("50");
        let formval = comp.educationForm.value;
        expect(comp.validateForm(formval)).toBe(true);
    });

    it("validateForm shouldreturn false", () => {
        comp.educationForm.controls['percentage'].setValue("120");
        let formval = comp.educationForm.value;
        const toasrCtrlStub  = TestBed.get(ToastController);
        const translateStub =  TestBed.get(TranslateService);
        spyOn(comp, 'getToast').and.returnValue({
            present: () => {}
        });
        expect(comp.validateForm(formval)).toBe(false);
        expect(comp.getToast).toHaveBeenCalled();
        
    });

    it("should handle success scenario for updateEducation", () => {
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

        comp.updateEducation("req");
        expect(comp.getToast).toHaveBeenCalled();
        expect(comp.translateMessage).toHaveBeenCalledWith("PROFILE_UPDATE_SUCCESS");
    })

    it("should handle error scenario for updateEducation", () => {
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
        
        comp.updateEducation("req");
        expect(comp.getToast).toHaveBeenCalled();
        expect(comp.translateMessage).toHaveBeenCalledWith("PROFILE_UPDATE_FAILED");
    })

    it("getToast should make expected calls", () => {
        const toasrCtrlStub  = TestBed.get(ToastController);
        let msg = "testMessage";
        let getToast = comp.getToast(msg);
        expect(comp.options.message).toEqual(msg);
    });

    it("getLoader makes expected calls", () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
        expect(loadingController.create).toHaveBeenCalled();
    });

    it("showDeleteConfirm should make expected calls", () => {
        const alertController = TestBed.get(AlertController);
        // const alert = TestBed.get(Alert);
        const translateStub =  TestBed.get(TranslateService);
        const platformStub: Platform = TestBed.get(Platform);
        spyOn(platformStub, "registerBackButtonAction");
        spyOn(comp, "translateMessage");
        comp.showDeleteConfirm();
        expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
        expect(alertController.create).toHaveBeenCalled();
    });

});
