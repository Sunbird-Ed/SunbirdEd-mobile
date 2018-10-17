import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { } from 'jasmine';
import { LoadingController } from 'ionic-angular';
import { mockRes } from './reports.spec.data';
import {
    ProfileService,
    GroupService,
    ProfileRequest,
    GroupRequest,
    InteractSubtype,
    InteractType,
    PageId,
    Environment,
    ImpressionType,
    TelemetryObject,
    ObjectType,
    ServiceProvider,
    TelemetryService
} from 'sunbird';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { ReportsPage } from './reports';
import { NavMock, NavParamsMock, LoadingControllerMock, TranslateServiceStub } from '../../../test-config/mocks-ionic';
import { Observable } from 'rxjs';
// import { myMap } from './user-report.spec.data';



describe('ReportsPage', () => {
    let comp: ReportsPage;
    let fixture: ComponentFixture<ReportsPage>;
    let translateService: TranslateService;


    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ReportsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ProfileService, GroupService, ProfileRequest, GroupRequest, InteractSubtype, InteractType, PageId,
                Environment, ImpressionType, TelemetryGeneratorService, TelemetryObject, ObjectType, ServiceProvider, TelemetryService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: TranslateService, useClass: TranslateServiceStub },
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(ReportsPage);
        comp = fixture.componentInstance;

    }));
    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        });
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    it('should create a valid instance of ReportsPage', () => {
        expect(comp instanceof ReportsPage).toBe(true);
    });
    it('IonViewDidLoad should make expected calls', () => {
        const telemeGeneratorStub = TestBed.get(TelemetryGeneratorService);
        spyOn(telemeGeneratorStub, 'generateImpressionTelemetry');
        comp.ionViewDidLoad();
        expect(telemeGeneratorStub.generateImpressionTelemetry).toHaveBeenCalled();
    });
    it('IonViewDidLoad should populate users', () => {
        const profileService = TestBed.get(ProfileService);
        spyOn(profileService, 'getAllUserProfile').and.returnValue(Promise.resolve(mockRes.data));
        //spyOn(profileService,'getCurrentUser').and.returnValue(Promise.resolve(mockRes.data[0]));
        comp.ionViewDidLoad();
        expect(profileService.getAllUserProfile).toHaveBeenCalled();
        // expect(profileService.getCurrentUser).toHaveBeenCalled();
    });
    it('IonViewDidLoad should populate users', () => {
        const profileService = TestBed.get(ProfileService);
        console.log("First Obbject",mockRes.data[0])
        spyOn(profileService, 'getCurrentUser').and.returnValue(Promise.resolve(mockRes.data[0]));
        comp.ionViewDidLoad();
        expect(profileService.getCurrentUser).toHaveBeenCalled();
    });
    it('IonViewDidLoad should populate Groups', () => {
        const groupService = TestBed.get(GroupService);
        spyOn(groupService, 'getAllGroup').and.returnValue(Promise.resolve(mockRes.groups));
        //spyOn(profileService,'getCurrentUser').and.returnValue(Promise.resolve(mockRes.data[0]));
        comp.ionViewDidLoad();
        expect(groupService.getAllGroup).toHaveBeenCalled();
        // expect(profileService.getCurrentUser).toHaveBeenCalled();
    });

});
