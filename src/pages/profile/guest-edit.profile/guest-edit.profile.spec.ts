import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NavController, NavParams, Platform, IonicApp, Events, App } from "ionic-angular";
import { ToastController, LoadingController } from "ionic-angular";
import { FormBuilder } from "@angular/forms";
import { CategoryRequest, ProfileService, SharedPreferences, ContainerService } from "sunbird";
import { FormAndFrameworkUtilService } from "../formandframeworkutil.service";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { AppGlobalService } from "../../../service/app-global.service";
import { GuestEditProfilePage } from "./guest-edit.profile";

import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavMock, NavParamsMock, profileServiceMock,
    SharedPreferencesMock, FormAndFrameworkUtilServiceMock, ContainerServiceMock
} from '../../../../test-config/mocks-ionic';

describe("GuestEditProfilePage", () => {
    let comp: GuestEditProfilePage;
    let fixture: ComponentFixture<GuestEditProfilePage>;

    beforeEach(() => {

        const eventsStub = {
            publish: () => ({})
        };

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
            },
            _toastPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
        };

        const platformStub = {
            registerBackButtonAction: () => ({})
        };

        const categoryRequestStub = {};

        const containerServiceStub = {};
        const formAndFrameworkUtilServiceStub = {
            getSyllabusList: () => ({
                then: () => ({})
            }),
            getFrameworkDetails: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            getCategoryData: () => ({
                then: () => ({})
            })
        };
        const telemetryGeneratorServiceStub = {
            generateImpressionTelemetry: () => ({}),
            generateInteractTelemetry: () => ({})
        };
        const appStub = {
            getRootNav: () => ({
                setRoot: () => ({})
            })
        };
        const appGlobalServiceStub = {};
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [GuestEditProfilePage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Events, useValue: eventsStub },
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: Platform, useValue: platformStub },
                { provide: CategoryRequest, useValue: categoryRequestStub },
                { provide: ProfileService, useClass: profileServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ContainerService, useValue: ContainerServiceMock },
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: App, useValue: appStub },
                { provide: AppGlobalService, useValue: appGlobalServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(GuestEditProfilePage);
        comp = fixture.componentInstance;
    });

    let getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    }

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });


    it("ionViewDidLoad makes expected calls", () => {
        comp.isNewUser = true;
        const telemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorServiceStub, "generateImpressionTelemetry");
        spyOn(telemetryGeneratorServiceStub, "generateInteractTelemetry");
        comp.ionViewDidLoad();
        expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
        expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();

        comp.isNewUser = false;
        comp.ionViewDidLoad();
        expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
        expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
    });

    it("ionViewWillEnter makes expected calls", () => {
        spyOn(comp, "getSyllabusDetails");
        comp.ionViewWillEnter();
        expect(comp.getSyllabusDetails).toHaveBeenCalled();
    });

    it("guestEditForm should edit form", () => {
        spyOn(comp.guestEditForm, "patchValue")
        comp.onProfileTypeChange();
        expect(comp.guestEditForm.patchValue).toHaveBeenCalled();
    });

    it("dismissPopup makes expected calls", () => {
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, "getActive")
        comp.dismissPopup();
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
    });

    it("dismissPopup makes expected calls", () => {
        const ionicApp = TestBed.get(IonicApp);
        const navStub = TestBed.get(NavController);
        spyOn(navStub, "pop");
        spyOn(ionicApp._modalPortal, "getActive").and.returnValue(false);
        spyOn(ionicApp._toastPortal, "getActive").and.returnValue(false);
        spyOn(ionicApp._overlayPortal, "getActive").and.returnValue(false);
        comp.dismissPopup();
        expect(ionicApp._modalPortal.getActive).toHaveBeenCalled();
        expect(navStub.pop).toHaveBeenCalled();
    });


    it("should handle success scenario for getSyllabusDetails", () => {
        getLoader();
        let data = [{ name: "sampleName", frameworkId: "sampleframeworkId" }];
        comp.profile = {
            syllabus: ["sampleSyllabus"]
        }
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve('true'));
        comp.getSyllabusDetails();
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        expect(comp.isFormValid).toBe(true);
    });

    it("should handle success scenario for getSyllabusDetails", () => {
        getLoader();
        let data = [{ name: "sampleName", frameworkId: "sampleframeworkId" }];
        comp.profile = "";
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
        comp.getSyllabusDetails();
    });

    it("should handle success scenario for getSyllabusDetails", () => {
        getLoader();
        let data = [];
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
        comp.getSyllabusDetails();
    });

    it("should handle failure scenario for getFrameworkDetails", () => {
        getLoader();
        let data = [{ name: "sampleName", frameworkId: "sampleframeworkId" }];
        comp.profile = {
            syllabus: ["sampleSyllabus"]
        }
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.reject('error'));
        comp.getSyllabusDetails();
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
    });

    it("getCategoryData should make expected calls", () => {
        // getLoader();
        comp.loader = {
            dismiss: () => { }
        }
        let data = [{ name: "sampleName", frameworkId: "sampleframeworkId" }];
        let request: CategoryRequest = {
            currentCategory: "currentCategory",
            selectedLanguage: "en"
        }
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve(data));
        comp.getCategoryData(request, "list");
        expect(formAndFrameworkUtilServiceStub.getCategoryData).toHaveBeenCalled();
    });

    it("resetForm should make expected calls", () => {
        getLoader();
        spyOn(comp.guestEditForm, "patchValue")
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        spyOn(comp, "checkPrevValue");
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve('success'));
        comp.resetForm(0, true);
        expect(comp.guestEditForm.patchValue).toHaveBeenCalled();

        comp.resetForm(1, true);
        expect(comp.guestEditForm.patchValue).toHaveBeenCalled();

        comp.resetForm(2, true);
        expect(comp.guestEditForm.patchValue).toHaveBeenCalled();

        comp.resetForm(3, true);
        expect(comp.guestEditForm.patchValue).toHaveBeenCalled();
    });

    it("onSubmit should make expected calls", () => {
        comp.isFormValid = false;
        comp.onSubmit();
    });

    it("onSubmit should make expected calls", () => {
        getLoader();
        spyOn(comp, "submitNewUserForm");
        spyOn(comp, "submitEditForm");
        comp.isFormValid = true;
        comp.isNewUser = true;
        comp.guestEditForm.controls['boards'].setValue("sampleboards");
        comp.onSubmit();
        expect(comp.submitNewUserForm).toHaveBeenCalled();

        comp.isNewUser = false;
        comp.onSubmit();
        expect(comp.submitEditForm).toHaveBeenCalled();

    });
    
    it("submitEditForm should make expected calls", () => {
        let loader = {
            dismiss: () => { }
        }
        const profileServiceStub = TestBed.get(ProfileService)
        spyOn(profileServiceStub, "updateProfile").and.callFake((req, success, error) => {
            success("success");
        });
        comp.guestEditForm.controls['grades'].setValue(["A", "B"]);
        comp.guestEditForm.controls['syllabus'].setValue(["testsyllabus"]);
        let formval = comp.guestEditForm.value;
        comp.submitEditForm(formval, loader);
        expect(profileServiceStub.updateProfile).toHaveBeenCalled();
    });

    it("submitEditForm should make expected calls", () => {
        let loader = {
            dismiss: () => { }
        }
        const profileServiceStub = TestBed.get(ProfileService)
        spyOn(profileServiceStub, "updateProfile").and.callFake((req, success, error) => {
            error("error");
        });
        comp.guestEditForm.controls['grades'].setValue(["A", "B"]);
        let formval = comp.guestEditForm.value;
        comp.submitEditForm(formval, loader);
        expect(profileServiceStub.updateProfile).toHaveBeenCalled();
    });

    it("submitNewUserForm should make expected calls", () => {
        let loader = {
            dismiss: () => { }
        }
        const profileServiceStub = TestBed.get(ProfileService)
        spyOn(profileServiceStub, "createProfile").and.callFake((req, success, error) => {
            success("success");
        });
        comp.guestEditForm.controls['grades'].setValue(["A", "B"]);
        comp.guestEditForm.controls['syllabus'].setValue(["testsyllabus"]);
        let formval = comp.guestEditForm.value;
        comp.submitNewUserForm(formval, loader);
        expect(profileServiceStub.createProfile).toHaveBeenCalled();
    });

    it("submitNewUserForm should make expected calls", () => {
        let loader = {
            dismiss: () => { }
        }
        const profileServiceStub = TestBed.get(ProfileService)
        spyOn(profileServiceStub, "createProfile").and.callFake((req, success, error) => {
            error("error");
        });
        comp.guestEditForm.controls['grades'].setValue(["A", "B"]);
        let formval = comp.guestEditForm.value;
        comp.submitNewUserForm(formval, loader);
        expect(profileServiceStub.createProfile).toHaveBeenCalled();
    });

    it("publishProfileEvents", () => {
        const containerService = TestBed.get(ContainerService);
        comp.guestEditForm.controls['syllabus'].setValue(["samplesyllabus"]);
        let formval = comp.guestEditForm.value;
        comp.publishProfileEvents(formval);

        comp.guestEditForm.controls['boards'].setValue(["sampleBoards"]);
        comp.guestEditForm.controls['grades'].setValue(["A", "B"]);
        comp.guestEditForm.controls['subjects'].setValue(["samplesubjects"]);
        comp.guestEditForm.controls['medium'].setValue(["samplemedium"]);
        let formval2 = comp.guestEditForm.value;
        comp.publishProfileEvents(formval2);

    });

});
