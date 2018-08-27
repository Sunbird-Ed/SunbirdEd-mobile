import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, group } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { AppGlobalService } from "../../../service/app-global.service";
import { FormAndFrameworkUtilService } from "../../profile/formandframeworkutil.service";
import { GroupService, SharedPreferences, ServiceProvider } from "sunbird";
import { FormBuilder } from "@angular/forms";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { LoadingController } from "ionic-angular";
import { CreateGroupPage } from "./create-group";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";

import {  ToastControllerMock } from 'ionic-mocks';
describe("CreateGroupPage", () => {
    let comp: CreateGroupPage;
    let fixture: ComponentFixture<CreateGroupPage>;
    beforeEach(() => {
        const telemetryGeneratorServiceStub = {
            generateImpressionTelemetry: () => ({}),
            generateInteractTelemetry: () => ({})
        };
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
        const appGlobalServiceStub = {};
        const formAndFrameworkUtilServiceStub = {
            getSyllabusList: () => ({
                then: () => ({})
            }),
            getFrameworkDetails: () => ({
                then: () => ({
                    then: () => ({
                        catch: () => ({})
                    })
                })
            }),
            getCategoryData: () => ({})
        };
        const SharedPreferencesStub = {
            getString: () => ({})
        };
        const groupServiceStub = {
            updateGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            })
        };
        const formBuilderStub = {
            group: () => ({})
        };
        const translateServiceStub = {
            get: () => ({
                subscribe: () => ({})
            })
        };
        const loadingControllerStub = {
            create: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [CreateGroupPage],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                ServiceProvider,
                { provide: SharedPreferences, useValue: SharedPreferencesStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                // { provide: ToastController, useValue: toastControllerStub },
                { provide: AppGlobalService, useValue: appGlobalServiceStub },
                { provide: FormAndFrameworkUtilService, useValue: formAndFrameworkUtilServiceStub },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: FormBuilder, useValue: formBuilderStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: LoadingController, useValue: loadingControllerStub },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
            ]
        });
        spyOn(CreateGroupPage.prototype, 'getSyllabusDetails');
        fixture = TestBed.createComponent(CreateGroupPage);
        comp = fixture.componentInstance;
    });
    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });
    it("classList defaults to: []", () => {
        expect(comp.classList).toEqual([]);
    });
    it("isEditGroup defaults to: false", () => {
        expect(comp.isEditGroup).toEqual(false);
    });
    it("syllabusList defaults to: []", () => {
        expect(comp.syllabusList).toEqual([]);
    });
    it("categories defaults to: []", () => {
        expect(comp.categories).toEqual([]);
    });
    describe("constructor", () => {
        it("makes expected calls", () => {
            expect(CreateGroupPage.prototype.getSyllabusDetails).toHaveBeenCalled();
        });
    });
    describe("getSyllabusDetails", () => {
        it("makes expected calls", () => {
            const formAndFrameworkUtilServiceStub: FormAndFrameworkUtilService = fixture.debugElement.injector.get(FormAndFrameworkUtilService);
            spyOn(comp, "getLoader");
            // spyOn(comp, "getClassList");
            // spyOn(comp, "getToast");
            // spyOn(comp, "translateMessage");
            spyOn(formAndFrameworkUtilServiceStub, "getSyllabusList").and.returnValue(Promise.resolve([]));
            comp.getLoader = jasmine.createSpy().and.callFake(function() {
                return {present: function() {}, dismiss: function() {}}
            });
            (<jasmine.Spy>comp.getSyllabusDetails).and.callThrough();
            comp.getSyllabusDetails();
            expect(comp.getLoader).toHaveBeenCalled();
            // expect(comp.getClassList).toHaveBeenCalled();
            // expect(comp.getToast).toHaveBeenCalled();
            // expect(comp.translateMessage).toHaveBeenCalled();
            expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        });
        it('makes expected calls', function () {
            spyOn(comp, "getClassList").and.callThrough();
            comp.getLoader = jasmine.createSpy().and.callFake(function() {
                return {present: function() {}, dismiss: function() {}}
            });
            comp.groupEditForm.patchValue = () => ({});
            comp.getClassList('abcd', true);
            expect(comp.getClassList).toHaveBeenCalled();
           // expect(this.plugin.refresh.calls.count()).toEqual(1);
        });
        // it('makes expected calls', function () {
        //     spyOn(comp, "getClassList").and.callThrough();
        //     comp.getLoader = jasmine.createSpy().and.callFake(function() {
        //         return {present: function() {}, dismiss: function() {}}
        //     });
        //     comp.getClassList('abcd', false);
        //     expect(comp.getClassList).toHaveBeenCalled();
        //    // expect(this.plugin.refresh.calls.count()).toEqual(1);
        // });

    });
    describe("goToGuestEdit", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.goToGuestEdit();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });
    // describe("navigateToUsersList", () => {
    //     it("makes expected calls", () => {
    //         comp.groupEditForm.controls['name'].setValue('im');
    //         const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
    //         spyOn(comp, "getToast");
    //         spyOn(comp, "translateMessage");
    //         spyOn(navControllerStub, "push");
    //         // comp['name'] = jasmine.createSpy().and.callFake(function () {
    //         //     return { name: function () { } }
    //         // })
    //         comp.groupEditForm["value"].setValue({'name': 's', 'class': 'KG', 'syllabus': 'Maths'});
    //         comp.navigateToUsersList();
    //         expect(comp.getToast).toHaveBeenCalled();
    //         expect(comp.translateMessage).toHaveBeenCalled();
    //         expect(navControllerStub.push).toHaveBeenCalled();
    //     });
    // });
    // describe("updateGroup", () => {

    //     it("makes expected calls", () => {
    //         const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
    //         const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
    //         spyOn(comp, "getLoader");
    //         spyOn(comp, "getToast");
    //         spyOn(comp, "translateMessage");
    //         spyOn(navControllerStub, "popTo");
    //         spyOn(navControllerStub, "getByIndex");
    //         spyOn(navControllerStub, "length");
    //         spyOn(groupServiceStub, "updateGroup").and.returnValue(Promise.resolve([]));
    //         comp.getLoader = jasmine.createSpy().and.callFake(function() {
    //             return {present: function() {}, dismiss: function() {}}
    //         })

    //         comp.groupEditForm.setValue({'name': 's', 'class': 'KG', 'syllabus': 'Maths'});
    //         // comp.getLoader = jasmine.createSpy().and.callFake(function() {
    //         //     return {present:function() {}}
    //         // })
    //         comp.updateGroup();
    //         expect(comp.getLoader).toHaveBeenCalled();
    //         // expect(comp.getToast).toHaveBeenCalled();
    //         // expect(comp.translateMessage).toHaveBeenCalled();
    //         // expect(navControllerStub.popTo).toHaveBeenCalled();
    //         // expect(navControllerStub.getByIndex).toHaveBeenCalled();
    //         // expect(navControllerStub.length).toHaveBeenCalled();
    //         expect(groupServiceStub.updateGroup).toHaveBeenCalled();
    //     });
    // });
    describe("getLoader", () => {
        it("makes expected calls", () => {
            const loadingControllerStub: LoadingController = fixture.debugElement.injector.get(LoadingController);
            spyOn(loadingControllerStub, "create");
            comp.getLoader();
            expect(loadingControllerStub.create).toHaveBeenCalled();
        });
    });
});