import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { NgZone } from "@angular/core";
import { NavController, Alert } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { PopoverController } from "ionic-angular";
import { AlertController , Content } from "ionic-angular";
import { GroupService, ProfileType, UserSource } from "sunbird";
import { ProfileService } from "sunbird";
import { OAuthService } from "sunbird";
import { ContainerService } from "sunbird";
import { SharedPreferences } from "sunbird";
import { AuthService } from "sunbird";
import { Events } from "ionic-angular";
import { AppGlobalService } from "../../../service/app-global.service";
import { App } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { GroupDetailsPage } from "./group-details";
import { } from "jasmine";
import { Observable } from "rxjs";
import { AlertControllerMock, AlertMock } from 'ionic-mocks'

describe("GroupDetailsPage", () => {
    let comp: GroupDetailsPage;
    let fixture: ComponentFixture<GroupDetailsPage>;
    let alertCtrl: AlertController;
    let alert: Alert;

    beforeEach(() => {
        alert = AlertMock.instance();
        alertCtrl = AlertControllerMock.instance(alert);
        const translateServiceStub = {
            get: () => ({
                subscribe: () => ({})
            })
        };
        // const ngZoneStub = {
        //     run: () => ({})
        // };
        const navControllerStub = {
            popTo: () => ({}),
            getByIndex: () => ({}),
            length: () => ({}),
            push: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        const loadingControllerStub = {
            create: () => ({})
        };
        const popoverControllerStub = {
            create: () => ({
                dismiss: () => ({}),
                present: () => ({})
            })
        };
        const alertControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const groupServiceStub = {
            deleteGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            addUpdateProfilesToGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            setCurrentGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            })
        };
        const profileServiceStub = {
            getAllUserProfile: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            setCurrentUser: () => ({})
        };
        const oAuthServiceStub = {
            doLogOut: () => ({
                then: () => ({})
            })
        };
        const containerServiceStub = {};
        const sharedPreferencesStub = {
            putString: () => ({})
        };
        const authServiceStub = {
            endSession: () => ({})
        };
        const eventsStub = {
            publish: () => ({})
        };
        const appGlobalServiceStub = {
            isUserLoggedIn: () => ({})
        };
        const appStub = {
            getRootNav: () => ({
                setRoot: () => ({})
            })
        };
        const toastControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const networkStub = {
            type: {}
        };
        const telemetryGeneratorServiceStub = {
            generateInteractTelemetry: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [GroupDetailsPage],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: TranslateService, useValue: translateServiceStub },
                //{ provide: NgZone, useValue: ngZoneStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: LoadingController, useValue: loadingControllerStub },
                { provide: PopoverController, useValue: popoverControllerStub },
                { provide: AlertController, useValue: alertControllerStub },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: OAuthService, useValue: oAuthServiceStub },
                { provide: ContainerService, useValue: containerServiceStub },
                { provide: SharedPreferences, useValue: sharedPreferencesStub },
                { provide: AuthService, useValue: authServiceStub },
                { provide: Events, useValue: eventsStub },
                { provide: AppGlobalService, useValue: appGlobalServiceStub },
                { provide: App, useValue: appStub },
                { provide: ToastController, useValue: toastControllerStub },
                { provide: Network, useValue: networkStub },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub }
            ]
        });
        fixture = TestBed.createComponent(GroupDetailsPage);
        // comp.group.gid = 'abcd123';
        // comp.currentGroupId = 'abcd123';
        // comp.playContent = undefined;
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("userList defaults to: []", () => {
        expect(comp.userList).toEqual([]);
    });

    it("userUids defaults to: []", () => {
        expect(comp.userUids).toEqual([]);
    });

    it("isNoUsers defaults to: false", () => {
        expect(comp.isNoUsers).toEqual(false);
    });

    it("isCurrentGroupActive defaults to: false", () => {
        expect(comp.isCurrentGroupActive).toEqual(false);
    });

    // it('playContent should be default: ', () => {
    //     comp.playContent = undefined;
    //     expect(comp.playContent).toEqual(undefined);
    // });

    // it('isCurrentGroupId shhould be true', () => {
    //     console.log("comp", comp);
    //     comp.group.gid = 'abcd123';
    //     comp.currentGroupId = 'abcd123';
    //     comp = fixture.componentInstance;
    //     expect(comp.isCurrentGroupActive).toBe(true);
    // })

    describe("ionViewWillEnter", () => {
        it("makes expected calls", () => {
            spyOn(comp, "getAllProfile");
            comp.ionViewWillEnter();
            expect(comp.getAllProfile).toHaveBeenCalled();
        });
    });

    // describe("resizeContent",()=>{
    //     comp.resizeContent();
    // })

    describe("getAllProfile", () => {
        it("makes expected calls", () => {
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
            spyOn(profileServiceStub, "getAllUserProfile").and.returnValue(Promise.resolve({}));
            spyOn(comp, "getLoader");
            comp.getLoader = jasmine.createSpy().and.callFake(function () {
                return { present: function () { }, dismiss: function () { } }
            })
            //spyOn(profileServiceStub, "getAllUserProfile");
            comp.getAllProfile();
            expect(comp.getLoader).toHaveBeenCalled();
            expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
        });
    });

    describe("switchAccountConfirmBox", () => {
        it("makes expected calls", () => {
            const alertControllerStub: AlertController = fixture.debugElement.injector.get(AlertController);
            const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            let TEACHER: ProfileType;
            let LOCAL: UserSource;
            comp.userList = [{
                uid: '212212',
                source: LOCAL,
                handle: 'abcd',
                profileType: TEACHER
            }];
            comp.selectedUserIndex = 0;
            spyOn(comp, "translateMessage");
            //spyOn(comp, "logOut");
            spyOn(alertControllerStub, "create");
            spyOn(appGlobalServiceStub, "isUserLoggedIn");
            spyOn(telemetryGeneratorServiceStub, "generateInteractTelemetry");
            let translate = TestBed.get(TranslateService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            comp.switchAccountConfirmBox();
            expect(comp.translateMessage).toHaveBeenCalled();
            //expect(comp.logOut).toHaveBeenCalled();
            expect(alertControllerStub.create).toHaveBeenCalled();
            expect(appGlobalServiceStub.isUserLoggedIn).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

    describe("play", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const eventsStub: Events = fixture.debugElement.injector.get(Events);
            const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
            spyOn(comp, "logOut");
            spyOn(navControllerStub, "popTo").and.returnValue(Promise.resolve());
            spyOn(eventsStub, "publish");
            spyOn(appGlobalServiceStub, "isUserLoggedIn").and.returnValue(true);
            comp["appGlobalService"].isUserLoggedIn = function() { return true }
            comp.play();
            expect(comp.logOut).toHaveBeenCalled();
            //expect(navControllerStub.popTo).toHaveBeenCalled();
            //expect(eventsStub.publish).toHaveBeenCalled();
           
        });
    });

    describe("deleteGroupConfirmBox", () => {
        it("makes expected calls", () => {
            const alertControllerStub: AlertController = fixture.debugElement.injector.get(AlertController);
            spyOn(comp, "translateMessage");
            spyOn(comp, "deleteGroup");
            comp.deleteGroup();
            spyOn(alertControllerStub, "create").and.callFake(() => {
                return {
                    present: () => ({})
                }
            });
            comp.getLoader = jasmine.createSpy().and.callFake(function () {
                return { present: function () { }, dismiss: function () { } }
            });

            comp.deleteGroupConfirmBox();
            expect(comp.translateMessage).toHaveBeenCalled();
            expect(comp.deleteGroup).toHaveBeenCalled();
            expect(alertControllerStub.create).toHaveBeenCalled();
        });
    });

    describe("deleteGroup", () => {
        it("makes expected calls", (done) => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            spyOn(navControllerStub, "popTo").and.returnValue(Promise.resolve([]));
            // spyOn(navControllerStub, "getByIndex");
            // spyOn(navControllerStub, "length");
            //spyOn(groupServiceStub, "deleteGroup");
            spyOn(telemetryGeneratorServiceStub, "generateInteractTelemetry");
            spyOn(groupServiceStub, "deleteGroup").and.returnValue(Promise.resolve([]));
            comp.deleteGroup();
            setTimeout(function() {
                expect(navControllerStub.popTo).toHaveBeenCalled();
                // expect(navControllerStub.getByIndex).toHaveBeenCalled();
                // expect(navControllerStub.length).toHaveBeenCalled();
                expect(groupServiceStub.deleteGroup).toHaveBeenCalled();
                expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
                done()
            }, 100)
        });
    });

    describe("navigateToAddUser", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.navigateToAddUser();
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
