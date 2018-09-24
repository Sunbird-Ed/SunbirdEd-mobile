import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Network } from '@ionic-native/network';

import {
    NavController, Events, IonicModule, NavParams, PopoverController
} from 'ionic-angular';

import {
    NetworkMock,
} from 'ionic-mocks';

import {
    AuthService, FrameworkModule,
    ContentService, TelemetryService, CourseService, ShareUtil, FrameworkService, SharedPreferences, ProfileType, FileUtil, PageId, InteractSubtype, Environment, InteractType
} from "sunbird";

import {
    NavMock, TranslateLoaderMock, NavControllerMock, FormAndFrameworkUtilServiceMock, NavParamsMockNew, AppGlobalServiceMock, PopoverControllerMock, AuthServiceMock
} from '../../../test-config/mocks-ionic';

import { } from 'jasmine';
import { AppVersion } from '@ionic-native/app-version';
import { mockRes } from './../page-filter/page.filter.spec.data';
import { PageFilter } from './../page-filter/page.filter';
import { CommonUtilService } from '../../service/common-util.service';
import { PipesModule } from '../../pipes/pipes.module';
import { mockView } from 'ionic-angular/util/mock-providers';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Platform } from 'ionic-angular/platform/platform';

describe('PageFilter Component', () => {
    let component: PageFilter;
    let fixture: ComponentFixture<PageFilter>;
    let spyTelemetryGeneratorService;
    let viewControllerMock = mockView();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageFilter],
            imports: [
                IonicModule.forRoot(PageFilter),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule
            ],
            providers: [
                CommonUtilService, AppGlobalService, TelemetryGeneratorService, TelemetryService,
                { provide: NavParams, useClass: NavParamsMockNew },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: NavController, useClass: NavMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: ViewController, useValue: viewControllerMock }
            ]
        })
    }));

    beforeEach(() => {
        NavParamsMockNew.setParams('filter', mockRes.filters);
        NavParamsMockNew.setParams('pageId', PageId.LIBRARY);
        const platformStub = TestBed.get(Platform);
        spyOn(platformStub, 'registerBackButtonAction').and.callFake((success)=>{
            return success()
        });

        const events =TestBed.get(Events);
        spyOn(events,'subscribe').and.callFake((arg,success)=>{
            return success('onAfterLanguageChange:update');
        });
        const appGlobalService = TestBed.get(AppGlobalService);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyTelemetryGeneratorService =spyOn(telemetryGeneratorService,'generateInteractTelemetry');
        spyOn(telemetryGeneratorService,'generateImpressionTelemetry').and.callFake(()=>{});
        spyTelemetryGeneratorService.and.callFake(()=>{});;
        spyOn(appGlobalService, 'getCurrentUser').and.returnValue({ syllabus: ['NCF'] });

        fixture = TestBed.createComponent(PageFilter);
        component = fixture.componentInstance;
    });

    it("#initFilterValues should initiate the filters", function () {
        component.initFilterValues();
        expect(component.filters).toBeDefined();
    });

    it("#cancel should dismiss the viewconroller", function () {
        const viewcontroller = TestBed.get(ViewController);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(viewcontroller, 'dismiss');
        component.cancel();
        expect(viewcontroller.dismiss).toHaveBeenCalled();
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
            InteractSubtype.CANCEL,
            Environment.HOME,
            PageId.LIBRARY_PAGE_FILTER);
    });

    it("#apply should dismiss the viewcontroller after applying the filter", function () {
        component.callback = {
            applyFilter(filter, appliedFilter) {
            }
        };
        component.facetsFilter = mockRes.filters;
        spyOn(component.callback, 'applyFilter');
        component.apply();
        expect(component.callback.applyFilter).toHaveBeenCalled();

    });

    it("#openFilterOptions should open the filter option popup", function () {
        const popOverController = TestBed.get(PopoverController);
        component.openFilterOptions(mockRes.filters[0]);
        expect(popOverController.create).toHaveBeenCalled();
    });

    it("#openFilterOptions should open the filter option popup", function () {
        expect(component.getSelectedOptionCount(mockRes.filters[0])).toBe('1 FILTER_ADDED');
        expect(component.getSelectedOptionCount(mockRes.filters[1])).toBe('');

    });

    it("#openFilterOptions should open the filter option popup", function () {
        const frameworkService = TestBed.get(FrameworkService);
        spyOn(frameworkService, 'getCategoryData').and.returnValue(Promise.resolve(JSON.stringify(mockRes.categoryDataResponse)));
        component.facetsFilter = mockRes.filters;
        component.getFrameworkData('ap_k_1', 'gradeLevel', 0);

    });

    it("#onLanguageSelected should open the filter option popup", function () {
        component.facetsFilter = mockRes.filters;
        component.onLanguageChange();

    });



});







