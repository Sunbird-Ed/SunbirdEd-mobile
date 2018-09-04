import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { LoadingController, ToastController, NavController } from "ionic-angular";
// import { NgZone } from "@angular/core";
import { AuthService } from "sunbird";
import { UserProfileService } from "sunbird";
import { SkillTagsComponent } from "./skill-tags";

import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavMock
    } from '../../../../test-config/mocks-ionic';
import { executionAsyncId } from 'async_hooks';
import { TagInputModule } from 'ngx-chips';

describe("SkillTagsComponent", () => {
    let comp: SkillTagsComponent;
    let fixture: ComponentFixture<SkillTagsComponent>;

    beforeEach(() => {
       
        
        const userProfileServiceStub = {
            getSkills: () => ({}),
            endorseOrAddSkill: () => ({})
        };
        
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(),TagInputModule],
            declarations: [ SkillTagsComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useClass: NavMock },
                // { provide: NgZone, useValue: ngZoneStub },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: UserProfileService, useValue: userProfileServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(SkillTagsComponent);
        comp = fixture.componentInstance;
    });

    let getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    }

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("should handle success scenario for ionViewWillEnter", () => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        let data = {skills : ["test"]};
        spyOn(userProfileService, "getSkills").and.callFake((req,success,error) => {
            success(JSON.stringify(data));
        });
        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success("success");
        });
        getLoader();
        comp.ionViewWillEnter();
        expect(authService.getSessionData).toHaveBeenCalled();
        expect(userProfileService.getSkills).toHaveBeenCalled();
        expect(comp.suggestedSkills).toEqual(data.skills);
    });

    it("should handle error scenario for shoulsionViewWillEnter", () => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        let data = {status : 401};
        spyOn(userProfileService, "getSkills").and.callFake((req,success,error) => {
            error(JSON.stringify(data));
        });
        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success("success");
        });
        getLoader();
        comp.ionViewWillEnter();
        expect(authService.getSessionData).toHaveBeenCalled();
        expect(userProfileService.getSkills).toHaveBeenCalled();
    });

    it("should handle error scenario for ionViewWillEnter", () => {
        const authService = TestBed.get(AuthService);
        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success(undefined);
        });
        getLoader();
        comp.ionViewWillEnter();
        expect(authService.getSessionData).toHaveBeenCalled();
    });

    it("should handle error scenario for addSkills", () => {
        const authService = TestBed.get(AuthService);
        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success(undefined);
        });
        getLoader();
        comp.addSkills();
        expect(authService.getSessionData).toHaveBeenCalled();
    });
    
    it("should handle success scenario for addSkills", () => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        let data = {
            skills : ["test"],
            userToken : "sampleUserToken"
        };

        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success(JSON.stringify(data));
        });

        spyOn(userProfileService, "endorseOrAddSkill").and.callFake((req, success, error) => {
            success("success");
        });
        
        getLoader();
        comp.addSkills();
        expect(authService.getSessionData).toHaveBeenCalled();
        expect(userProfileService.endorseOrAddSkill).toHaveBeenCalled();
    });

    it("should handle success scenario for addSkills", () => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        let data = {
            skills : ["test"],
            userToken : "sampleUserToken"
        };

        spyOn(authService, "getSessionData").and.callFake((success,error) => {
            success(JSON.stringify(data));
        });

        spyOn(userProfileService, "endorseOrAddSkill").and.callFake((req, success, error) => {
            error("error");
        });
        
        getLoader();
        comp.addSkills();
        expect(authService.getSessionData).toHaveBeenCalled();
        expect(userProfileService.endorseOrAddSkill).toHaveBeenCalled();
    });

    it("goBack will make expected calls", () => {
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, "pop");
        comp.goBack();
        expect(navCtrl.pop).toHaveBeenCalled();
    });

    it("presentToast makes expected calls", () => {
        const toastController = TestBed.get(ToastController);
        comp.presentToast("msg");
        expect(toastController.create).toHaveBeenCalled();
    });

    it("getLoader makes expected calls", () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
        expect(loadingController.create).toHaveBeenCalled();
    });

    it("translate msg should make expected calls", () => {
        const translate = TestBed.get(TranslateService);
        comp.translateMessage("msg");
        expect(translate.get).toHaveBeenCalled();
    });

});
