import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
//import { NgZone } from "@angular/core";
import { NavController, NavOptions } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { GroupService } from "sunbird";
import { ProfileService } from "sunbird";
import { LoadingController } from "ionic-angular";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { AddOrRemoveGroupUserPage } from "./add-or-remove-group-user";
import 'rxjs/add/observable/of';
import { } from 'jasmine';

import { LoadingControllerMock } from 'ionic-mocks';
export class MockToastCtrl {
    public instance: MockToast = new MockToast();
    public create ( options: any = {} ): MockToast {
        return this.instance;
    }
}
export class MockToast {
    public present( navOptions: any = {} ): Promise<any> {
        return Promise.resolve ( {} );
    }
    public dismiss( data?: any, role?: string, navOptions?: NavOptions ): Promise<any> {
        return Promise.resolve ( {} );
    }

    public onDidDismiss( callback: () => void ): void {
        callback();
        return;
    }
}
describe("AddOrRemoveGroupUserPage", () => {
    let comp: AddOrRemoveGroupUserPage;
    let fixture: ComponentFixture<AddOrRemoveGroupUserPage>;

    beforeEach(() => {
        // const ngZoneStub = {
        //     run: () => ({})
        // };
        const navControllerStub = {
            push: () => ({}),
            popTo: () => ({}),
            getByIndex: () => ({}),
            length: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        const toastControllerStub = {
            create: () => ({})
        };
        const alertControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const translateServiceStub = {
            get: () => ({
                subscribe: () => ({})
            })
        };
        const groupServiceStub = {
            addUpdateProfilesToGroup: () => ({
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
            })
        };
        const loadingControllerStub = {
            create: () => ({})
        };
        const telemetryGeneratorServiceStub = {
            generateInteractTelemetry: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [AddOrRemoveGroupUserPage],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                //     { provide: NgZone, useValue: ngZoneStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: ToastController, useValue: MockToastCtrl },
                { provide: AlertController, useValue: alertControllerStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                // { provide: LoadingController, useValue: loadingControllerStub },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub }
            ]
        });
        fixture = TestBed.createComponent(AddOrRemoveGroupUserPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("addUsers defaults to: true", () => {
        console.log("addUsers", comp.addUsers);
        expect(comp.addUsers).toEqual(true);
    });

    it("allUsers defaults to: []", () => {
        expect(comp.allUsers).toEqual([]);
    });

    it("selectedUids defaults to: []", () => {
        expect(comp.selectedUids).toEqual([]);
    });

    describe("ionViewWillEnter", () => {
        it("makes expected calls", () => {
            spyOn(comp, "getAllProfile");
            comp.ionViewWillEnter();
            expect(comp.getAllProfile).toHaveBeenCalled();
        });
    });

    describe("getAllProfile", () => {
        it("makes expected calls", () => {

            // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
            spyOn(profileServiceStub, "getAllUserProfile").and.returnValue(Promise.resolve([]));
            comp.groupMembers = [];
            comp.uniqueUserList = [];
            //  spyOn(ngZoneStub, "run");
            //  spyOn(profileServiceStub, "getAllUserProfile");
            comp.getAllProfile();
            //  expect(ngZoneStub.run).toHaveBeenCalled();
            expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
        });
    });

    describe("selectAll", () => {
        it("makes expected calls", () => {
            //const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            // spyOn(ngZoneStub, "run");
            comp.uniqueUserList = [];
            comp.selectAll();
            // expect(ngZoneStub.run).toHaveBeenCalled();
        });
    });

    describe("unselectAll", () => {
        it("makes expected calls", () => {
            comp.groupMembers = [];
            //  const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            //  spyOn(ngZoneStub, "run");
            comp.unselectAll();
            //  expect(ngZoneStub.run).toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("makes expected calls", () => {
            comp.groupMembers = [];
            spyOn(comp, "deleteUsersFromGroupConfirmBox");
            comp.remove();
            expect(comp.deleteUsersFromGroupConfirmBox).toHaveBeenCalled();
        });
    });

    describe("getSelectedUids", () => {
        it("makes expected calls", () => {
            comp.uniqueUserList = [];
            //   const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            // spyOn(ngZoneStub, "run");
            comp.getSelectedUids();
            // expect(ngZoneStub.run).toHaveBeenCalled();
        });
    });

    describe("getSelectedGroupMemberUids", () => {
        it("makes expected calls", () => {
            // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            // spyOn(ngZoneStub, "run");
            comp.groupMembers = [];
            comp.getSelectedGroupMemberUids();
            // expect(ngZoneStub.run).toHaveBeenCalled();
        });
    });

    describe("add", () => {
        it("makes expected calls", fakeAsync(() => {
            const loadingCtrl = TestBed.get(LoadingController);
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            // comp.getLoader = jasmine.createSpy().and.callFake(function () {
            //     return { present: function () { }, dismiss: function () { } }
            // });
            comp.groupMembers = [];
            spyOn(groupServiceStub, "addUpdateProfilesToGroup").and.returnValue(Promise.resolve([]));

            //  spyOn(comp, "getLoader");
            spyOn(comp, "getSelectedUids");
            spyOn(comp, "getToast");
            spyOn(comp, "translateMessage");
            spyOn(navControllerStub, "popTo");
            spyOn(navControllerStub, "getByIndex");
            spyOn(navControllerStub, "length");

            let translate = TestBed.get(TranslateService);
            const translateStub = TestBed.get(TranslateService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            comp.add();
            // expect(comp.getLoader).toHaveBeenCalled();
            expect(comp.getSelectedUids).toHaveBeenCalled();
           // expect(comp.);
            //expect(comp.translateMessage).toHaveBeenCalled();
            //tick(100);
           // expect(comp.getToast).toHaveBeenCalled();
            // expect(navControllerStub.popTo).toHaveBeenCalled();
            // expect(navControllerStub.getByIndex).toHaveBeenCalled();
            // expect(navControllerStub.length).toHaveBeenCalled();
            // expect(groupServiceStub.addUpdateProfilesToGroup).toHaveBeenCalled();
        }));
    });

    describe("deleteUsersFromGroup", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.resolve({}));
            comp.getLoader = jasmine.createSpy().and.callFake(function () {
                return { present: function () { }, dismiss: function () { } }
            });
            spyOn(console,'log').and.callThrough();
            spyOn(groupServiceStub, "addUpdateProfilesToGroup").and.returnValue(Promise.resolve([]));
            //  spyOn(comp, "getLoader");
            spyOn(comp, "getToast");
            spyOn(comp, "translateMessage");
            spyOn(navControllerStub, "popTo");
            spyOn(navControllerStub, "getByIndex");
            spyOn(navControllerStub, "length");
            //    spyOn(groupServiceStub, "addUpdateProfilesToGroup");
            spyOn(telemetryGeneratorServiceStub, "generateInteractTelemetry");
            comp.deleteUsersFromGroup();
            expect(comp.getLoader).toHaveBeenCalled();
            expect(comp.getToast).toHaveBeenCalled();
            expect(comp.translateMessage).toHaveBeenCalled();
            expect(navControllerStub.popTo).toHaveBeenCalled();
            expect(navControllerStub.getByIndex).toHaveBeenCalled();
            expect(navControllerStub.length).toHaveBeenCalled();
            expect(groupServiceStub.addUpdateProfilesToGroup).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
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
            // fixture.detectChanges();
            expect(translatedMessage).toEqual('Cancel');
            expect(spy.calls.any()).toEqual(true);
        }));
    });
});
