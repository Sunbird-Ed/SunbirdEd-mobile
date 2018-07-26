import { AppGlobalService } from './../../../service/app-global.service';
import { DirectivesModule } from './../../../directives/directives.module';
import { PipesModule } from './../../../pipes/pipes.module';
import { PBHorizontal } from './../../pbhorizontal/pb-horizontal';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Ionic2RatingModule } from "ionic2-rating";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs/Observable';

import { NavController, Events, IonicModule, NavParams, ToastController, 
    LoadingController, Platform } from 'ionic-angular';

import { StorageMock, ToastControllerMock,
    NetworkMock } from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, BuildParamService,
    ContentService, TelemetryService, CourseService, ProfileType, ShareUtil } from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock, PlatformMock
} from '../../../../test-config/mocks-ionic';
import { CourseUtilService } from '../../../service/course-util.service';
import { CourseCard } from "./course-card";

declare let GenieSDK: any;
import { mockRes } from './course-card.spec.data';


describe('CourseCard Component', () => {
    let component: CourseCard;
    let fixture: ComponentFixture<CourseCard>;
    let translateService: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CourseCard, PBHorizontal],
            imports: [
                IonicModule.forRoot(CourseCard),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule,
                DirectivesModule,
                Ionic2RatingModule
            ],
            providers: [
                ContentService, TelemetryService, CourseService, ShareUtil, CourseUtilService,
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalService },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() }
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseCard);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        })
    });

    it('should create a valid instance of CourseCard', () => {
        expect(component instanceof CourseCard).toBe(true);
        expect(component).not.toBeFalsy();
    });   

    it('should redirect to enrolled course details page', () => {
        component.course = {};
        const mockData = mockRes.contentCardDetails;
        const navCtrl = TestBed.get(NavController);
        spyOn(component, 'navigateToCourseDetailPage').and.callThrough();
        spyOn(navCtrl, 'push').and.callThrough();
        component.navigateToCourseDetailPage(mockData, 'Inprogress');
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.navigateToCourseDetailPage).toBeDefined();
        expect(component.navigateToCourseDetailPage).toHaveBeenCalledWith(mockData, 'Inprogress');
        expect(navCtrl.push).toHaveBeenCalled();
    });

    it('should redirect to collection details page', () => {
        component.course = {};
        const mockData = mockRes.collectionDetails;
        const navCtrl = TestBed.get(NavController);
        spyOn(component, 'navigateToCourseDetailPage').and.callThrough();
        spyOn(navCtrl, 'push').and.callThrough();
        component.navigateToCourseDetailPage(mockData, undefined);
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.navigateToCourseDetailPage).toBeDefined();
        expect(component.navigateToCourseDetailPage).toHaveBeenCalledWith(mockData, undefined);
        expect(navCtrl.push).toHaveBeenCalled();
    });

    it('should redirect to content details page', () => {
        component.course = {};
        const mockData = mockRes.contentDetails;
        const navCtrl = TestBed.get(NavController);
        spyOn(component, 'navigateToCourseDetailPage').and.callThrough();
        spyOn(navCtrl, 'push').and.callThrough();
        component.navigateToCourseDetailPage(mockData, undefined);
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.navigateToCourseDetailPage).toBeDefined();
        expect(component.navigateToCourseDetailPage).toHaveBeenCalledWith(mockData, undefined);
        expect(navCtrl.push).toHaveBeenCalled();
    });

    it('should resume course', () => {
        component.course = {};
        const mockData = mockRes.resumeCourse;
        const navCtrl = TestBed.get(NavController);
        const event = TestBed.get(Events);
        spyOn(event, 'publish').and.callThrough()
        spyOn(component, 'resumeCourse').and.callThrough();
        spyOn(navCtrl, 'push').and.callThrough();
        component.resumeCourse(mockData);
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.resumeCourse).toBeDefined();
        expect(component.resumeCourse).toHaveBeenCalledWith(mockData);
    });

    it('should redirect to enrolled course details page', () => {
        component.course = {};
        const mockData = mockRes.contentCardDetails;
        const navCtrl = TestBed.get(NavController);
        spyOn(component, 'resumeCourse').and.callThrough();
        spyOn(navCtrl, 'push').and.callThrough();
        component.resumeCourse(mockData);
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.resumeCourse).toBeDefined();
        expect(component.resumeCourse).toHaveBeenCalledWith(mockData);
        expect(navCtrl.push).toHaveBeenCalled();
    });

    it('should get course progress', () => {
        component.layoutName = 'Inprogress';
        component.course = {};
        component.course.leafNodesCount = 6;
        component.course.progress = 7;
        const courseUtilService = TestBed.get(CourseUtilService)
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(courseUtilService, 'getCourseProgress').and.callThrough();
        fixture.detectChanges();
        expect(component).not.toBeFalsy();
        expect(component.ngOnInit).toBeDefined();
        expect(courseUtilService.getCourseProgress).toHaveBeenCalled();
    });
});
