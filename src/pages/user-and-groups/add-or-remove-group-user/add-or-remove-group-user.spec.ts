/* import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
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
export class MockToastCtrl {
    public instance: MockToast = new MockToast();
    public create(options: any = {}): MockToast {
        return this.instance;
    }
}
export class MockToast {
    public present(navOptions: any = {}): Promise<any> {
        return Promise.resolve({});
    }
    public dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any> {
        return Promise.resolve({});
    }

    public onDidDismiss(callback: () => void): void {
        callback();
        return;
    }
}
describe("AddOrRemoveGroupUserPage", () => {
    let comp: AddOrRemoveGroupUserPage;
    let fixture: ComponentFixture<AddOrRemoveGroupUserPage>;

    beforeEach(() => {

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
                { provide: ToastController, useClass: MockToastCtrl },
                { provide: AlertController, useValue: alertControllerStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: LoadingController, useValue: loadingControllerStub },
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
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
            spyOn(profileServiceStub, "getAllUserProfile").and.returnValue(Promise.resolve([]));
            comp.groupMembers = [];
            comp.uniqueUserList = [];
            comp.getAllProfile();
            expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
        });
    });

    describe("selectAll", () => {
        it("makes expected calls", () => {

            comp.uniqueUserList = [];
            comp.selectAll();

        });
    });

    describe("unselectAll", () => {
        it("makes expected calls", () => {
            comp.groupMembers = [];

            comp.unselectAll();

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

            comp.getSelectedUids();

        });
    });

    describe("getSelectedGroupMemberUids", () => {
        it("makes expected calls", () => {

            comp.groupMembers = [];
            comp.getSelectedGroupMemberUids();

        });
    });

    describe("add", () => {
        it("makes expected calls", fakeAsync(() => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            comp.getLoader = jasmine.createSpy().and.callFake(function () {
                return { present: function () { }, dismiss: function () { } }
            });
            comp.groupMembers = [];
            spyOn(groupServiceStub, "addUpdateProfilesToGroup").and.returnValue(Promise.resolve([]));
            spyOn(comp, "getSelectedUids");
            let translate = TestBed.get(TranslateService);
            const translateStub = TestBed.get(TranslateService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            comp.add();
            expect(comp.getLoader).toHaveBeenCalled();
            expect(comp.getSelectedUids).toHaveBeenCalled();

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
            spyOn(console, 'log').and.callThrough();
            spyOn(groupServiceStub, "addUpdateProfilesToGroup").and.returnValue(Promise.resolve([]));

            comp.deleteUsersFromGroup();
            expect(comp.getLoader).toHaveBeenCalled();

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
            expect(translatedMessage).toEqual('Cancel');
            expect(spy.calls.any()).toEqual(true);
        }));
    });
}); */