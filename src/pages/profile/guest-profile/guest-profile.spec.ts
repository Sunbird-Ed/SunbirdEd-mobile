import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { PopoverController } from "ionic-angular";
import { Events } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { ProfileService } from "sunbird";
import { SharedPreferences } from "sunbird";
import { Network } from "@ionic-native/network";
import { TranslateService } from "@ngx-translate/core";
import { FormAndFrameworkUtilService } from "../formandframeworkutil.service";
import { AppGlobalService } from "../../../service/app-global.service";
import { GuestProfilePage } from "./guest-profile";
import { TranslateModule } from '@ngx-translate/core';
import {} from 'jasmine';

describe("GuestProfilePage", () => {
    let comp: GuestProfilePage;
    let fixture: ComponentFixture<GuestProfilePage>;

    beforeEach(() => {
        const navControllerStub = {
            push: () => ({})
        };
        const popoverControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const eventsStub = {
            subscribe: () => ({})
        };
        const loadingControllerStub = {
            create: () => ({})
        };
        const toastControllerStub = {
            create: () => ({})
        };
        const profileServiceStub = {
            getCurrentUser: () => ({})
        };
        const sharedPreferencesStub = {
            getString: () => ({})
        };
        const networkStub = {
            type: {},
            onDisconnect: () => ({
                subscribe: () => ({})
            }),
            onConnect: () => ({
                subscribe: () => ({})
            })
        };
        const translateServiceStub = {
            get: () => ({
                subscribe: () => ({})
            })
        };
        const formAndFrameworkUtilServiceStub = {
            getSyllabusList: () => ({
                then: () => ({})
            }),
            getFrameworkDetails: () => ({
                then: () => ({})
            })
        };
        const appGlobalServiceStub = {
            openPopover: () => ({})
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ GuestProfilePage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: PopoverController, useValue: popoverControllerStub },
                { provide: Events, useValue: eventsStub },
                { provide: LoadingController, useValue: loadingControllerStub },
                { provide: ToastController, useValue: toastControllerStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: SharedPreferences, useValue: sharedPreferencesStub },
                { provide: Network, useValue: networkStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: FormAndFrameworkUtilService, useValue: formAndFrameworkUtilServiceStub },
                { provide: AppGlobalService, useValue: appGlobalServiceStub }
            ]
        });
        spyOn(GuestProfilePage.prototype, 'refreshProfileData');
        fixture = TestBed.createComponent(GuestProfilePage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("imageUri defaults to: assets/imgs/ic_profile_default.png", () => {
        expect(comp.imageUri).toEqual("assets/imgs/ic_profile_default.png");
    });

    it("showSignInCard defaults to: false", () => {
        expect(comp.showSignInCard).toEqual(false);
    });

    it("showWarning defaults to: false", () => {
        expect(comp.showWarning).toEqual(false);
    });

    it("categories defaults to: []", () => {
        expect(comp.categories).toEqual([]);
    });

    describe("constructor", () => {
        it("makes expected calls", () => {
            expect(GuestProfilePage.prototype.refreshProfileData).toHaveBeenCalled();
        });
    });

    describe("editGuestProfile", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.editGuestProfile();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe("getLoader", () => {
        it("makes expected calls", () => {
            const loadingControllerStub: LoadingController = fixture.debugElement.injector.get(LoadingController);
            spyOn(loadingControllerStub, "create");
            comp.getLoader();
            expect(loadingControllerStub.create).toHaveBeenCalled();
        });
    });

    describe("getSyllabusDetails", () => {
        it("makes expected calls", () => {
            const formAndFrameworkUtilServiceStub: FormAndFrameworkUtilService = fixture.debugElement.injector.get(FormAndFrameworkUtilService);
            spyOn(comp, "getFrameworkDetails");
            spyOn(comp, "getToast");
            spyOn(comp, "translateMessage");
            spyOn(formAndFrameworkUtilServiceStub, "getSyllabusList");
            comp.getSyllabusDetails();
            expect(comp.getFrameworkDetails).toHaveBeenCalled();
            expect(comp.getToast).toHaveBeenCalled();
            expect(comp.translateMessage).toHaveBeenCalled();
            expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        });
    });

    describe("goToRoles", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(comp, "showNetworkWarning");
            spyOn(navControllerStub, "push");
            comp.goToRoles();
            expect(comp.showNetworkWarning).toHaveBeenCalled();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

});
