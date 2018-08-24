import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NgZone } from "@angular/core";
import { LoadingController } from "ionic-angular";
import { GroupService } from "sunbird";
import { ProfileService } from "sunbird";
import { FileUtil } from "sunbird";
import { SocialSharing } from "@ionic-native/social-sharing";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { ShareUserAndGroupPage } from "./share-user-and-groups";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { promise } from "selenium-webdriver";
import { } from 'jasmine';

import { LoadingControllerMock,
     } from 'ionic-mocks';

describe("ShareUserAndGroupPage", () => {
    let comp: ShareUserAndGroupPage;
    let fixture: ComponentFixture<ShareUserAndGroupPage>;

    beforeEach(() => {
        const ngZoneStub = {
            run: () => ({})
        };
        const loadingControllerStub = {
            create: () => ({
                present: () => ({}),
                dismiss: () => ({})
            })
        };
        const groupServiceStub = {
            getAllGroup: () => ({
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
            exportProfile: () => ({})
        };
        const fileUtilStub = {
            internalStoragePath: () => ({})
        };
        const socialSharingStub = {
            share: () => ({})
        };
        const telemetryGeneratorServiceStub = {
            generateInteractTelemetry: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [ ShareUserAndGroupPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [TranslateModule.forRoot()],
            providers: [
                //{ provide: NgZone, useValue: ngZoneStub },
                // { provide: LoadingController, useValue: loadingControllerStub },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: FileUtil, useValue: fileUtilStub },
                { provide: SocialSharing, useValue: socialSharingStub },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: TranslateService},
            ]
        });
        fixture = TestBed.createComponent(ShareUserAndGroupPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("userList defaults to: []", () => {
        expect(comp.userList).toEqual([]);
    });

    it("groupList defaults to: []", () => {
        expect(comp.groupList).toEqual([]);
    });

    it("selectedUserList defaults to: []", () => {
        expect(comp.selectedUserList).toEqual([]);
    });

    it("selectedGroupList defaults to: []", () => {
        expect(comp.selectedGroupList).toEqual([]);
    });

    describe("ionViewWillEnter", () => {
        it("makes expected calls", () => {
            spyOn(comp, "getAllProfile");
            spyOn(comp, "getAllGroup");
            comp.ionViewWillEnter();
            expect(comp.getAllProfile).toHaveBeenCalled();
            expect(comp.getAllGroup).toHaveBeenCalled();
        });
    });

    describe("getAllProfile", () => {
        it("makes expected calls", () => {
          //  const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
          //  spyOn(ngZoneStub, "run");
            spyOn(profileServiceStub, "getAllUserProfile").and.returnValue(Promise.resolve([]));
            comp.getAllProfile();
          //  expect(ngZoneStub.run).toHaveBeenCalled();
            expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
        });
    });

    describe("getAllGroup", () => {
        it("makes expected calls", () => {
           // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
          //  spyOn(ngZoneStub, "run");
            spyOn(groupServiceStub, "getAllGroup").and.returnValue(Promise.resolve([]));
            spyOn(profileServiceStub, "getAllUserProfile").and.callThrough;
            comp.getAllGroup();
          //  expect(ngZoneStub.run).toHaveBeenCalled();
            expect(groupServiceStub.getAllGroup).toHaveBeenCalled();
            // expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
        });
    });

    describe("selectAll", () => {
        it("makes expected calls", () => {
           const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            spyOn(comp, "toggleUserSelected");
            spyOn(comp, "toggleGroupSelected");
           spyOn(ngZoneStub, "run");
            comp.selectAll();
            // expect(comp.toggleUserSelected).toHaveBeenCalled();
            // expect(comp.toggleGroupSelected).toHaveBeenCalled();
           expect(ngZoneStub.run).toHaveBeenCalled();
        });
    });

    describe("share", () => {
        it("makes expected calls", () => {
            const loadingController = TestBed.get(LoadingController);
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
            const fileUtilStub: FileUtil = fixture.debugElement.injector.get(FileUtil);
            const socialSharingStub: SocialSharing = fixture.debugElement.injector.get(SocialSharing);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            let loader = jasmine.createSpy().and.callFake(function () {
                return { present: function () { }, dismiss: function () { } }
            });
            spyOn(profileServiceStub, "exportProfile");
            spyOn(fileUtilStub, "internalStoragePath");
            spyOn(socialSharingStub, "share");
            spyOn(telemetryGeneratorServiceStub, "generateInteractTelemetry");
            comp.share();
            expect(loadingController.create).toHaveBeenCalled();
            expect(profileServiceStub.exportProfile).toHaveBeenCalled();
            expect(fileUtilStub.internalStoragePath).toHaveBeenCalled();
            // expect(socialSharingStub.share).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

});
