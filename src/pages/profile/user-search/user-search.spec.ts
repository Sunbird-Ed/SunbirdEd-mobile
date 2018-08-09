import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "sunbird";
import { UserProfileService } from "sunbird";
import { TelemetryService } from "sunbird";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Renderer } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserSearchComponent } from "./user-search";
import { TranslateModule } from '@ngx-translate/core';
import {} from 'jasmine';

describe("UserSearchComponent", () => {
    let comp: UserSearchComponent;
    let fixture: ComponentFixture<UserSearchComponent>;

    beforeEach(() => {
        const authServiceStub = {
            getSessionData: () => ({})
        };
        const userProfileServiceStub = {
            searchUser: () => ({})
        };
        const telemetryServiceStub = {
            impression: () => ({})
        };
        const navControllerStub = {
            push: () => ({})
        };
        const navParamsStub = {};
        const loadingControllerStub = {
            create: () => ({})
        };
        const toastControllerStub = {
            create: () => ({})
        };
        const rendererStub = {
            invokeElementMethod: () => ({})
        };
        const translateServiceStub = {

            get: () => ({
                subscribe: () => ({})
            })
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ UserSearchComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: AuthService, useValue: authServiceStub },
                { provide: UserProfileService, useValue: userProfileServiceStub },
                { provide: TelemetryService, useValue: telemetryServiceStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: LoadingController, useValue: loadingControllerStub },
                { provide: ToastController, useValue: toastControllerStub },
                { provide: Renderer, useValue: rendererStub },
                { provide: TranslateService, useValue: translateServiceStub }
            ]
        });
        fixture = TestBed.createComponent(UserSearchComponent);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("userList defaults to: []", () => {
        expect(comp.userList).toEqual([]);
    });

    it("fallBackImage defaults to: ./assets/imgs/ic_profile_default.png", () => {
        expect(comp.fallBackImage).toEqual("./assets/imgs/ic_profile_default.png");
    });

    it("enableInfiniteScroll defaults to: false", () => {
        expect(comp.enableInfiniteScroll).toEqual(false);
    });

    it("showEmptyMessage defaults to: false", () => {
        expect(comp.showEmptyMessage).toEqual(false);
    });

    it("apiOffset defaults to: 0", () => {
        expect(comp.apiOffset).toEqual(0);
    });

    it("apiLimit defaults to: 10", () => {
        expect(comp.apiLimit).toEqual(10);
    });

    it("visibleItems defaults to: []", () => {
        expect(comp.visibleItems).toEqual([]);
    });

    it("visits defaults to: []", () => {
        expect(comp.visits).toEqual([]);
    });

    it("isContentLoaded defaults to: false", () => {
        expect(comp.isContentLoaded).toEqual(false);
    });

    describe("ionViewDidLoad", () => {
        it("makes expected calls", () => {
            const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(TelemetryService);
            spyOn(telemetryServiceStub, "impression");
            comp.ionViewDidLoad();
            expect(telemetryServiceStub.impression).toHaveBeenCalled();
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

    describe("checkClear", () => {
        it("makes expected calls", () => {
            spyOn(comp, "onInput");
            comp.checkClear();
            expect(comp.onInput).toHaveBeenCalled();
        });
    });

    describe("ionViewDidEnter", () => {
        xit("should make expected call after 100ms", fakeAsync(() => {
            expect(comp.input).toBeDefined();
            spyOn(comp.input, "setFocus");
            comp.ionViewDidEnter();
            // fixture.detectChanges();
            tick(100);
            expect(comp.input).toHaveBeenCalled();
        }));
    });

    describe("getToast", () => {
        it("Should not create ToastController if not passed any message for toast", () => {
            const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
            spyOn(toastCtrlStub, "create");
            comp.getToast();
            expect(toastCtrlStub.create).not.toHaveBeenCalled();
        });
        it("Should create ToastController", () => {
            const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
            spyOn(toastCtrlStub, "create");
            comp.getToast('Some Message');
            expect(toastCtrlStub.create).toHaveBeenCalled();
            expect(toastCtrlStub.create).toBeTruthy();
        });
    });

    describe("translateMessage", () => {
        it('should resolve test data', fakeAsync(() => {
            let translate = TestBed.get(TranslateService);
            const translateStub = TestBed.get(TranslateService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            let translatedMessage = comp.translateMessage('CANCEL');
            //fixture.detectChanges();
            expect(translatedMessage).toEqual('Cancel');
            expect(spy.calls.any()).toEqual(true);
          }));
    });
});
