import { PipesModule } from './../../pipes/pipes.module';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Network } from '@ionic-native/network';
import { DirectivesModule } from '../../directives/directives.module';
import { mockRes } from './report-isues.spec.data';

import {
    IonicModule, ViewController, NavParams, Platform, LoadingController
} from 'ionic-angular';


import {
    FrameworkModule,
    ContentService, TelemetryService, AuthService, GenieSDKServiceProvider, SharedPreferences
} from "sunbird";

import {
    TranslateLoaderMock, AuthServiceMock, GenieSDKServiceProviderMock, SharedPreferencesMock, LoadingControllerMock, NavParamsMockNew, NavControllerMock, ViewControllerMock, AppGlobalServiceMock
} from '../../../test-config/mocks-ionic';

import { } from 'jasmine';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { ReportIssuesComponent } from './report-issues';
import { NavController } from 'ionic-angular';
import { ToastControllerMock, PopoverControllerMock, NetworkMock } from 'ionic-mocks';
import { PopoverController } from 'ionic-angular';
import { PBHorizontal } from '../pbhorizontal/pb-horizontal';
import { AppGlobalService } from '../../service/app-global.service';
import { Observable } from 'rxjs';
import { CommonUtilService } from '../../service/common-util.service';
import { mockView } from "ionic-angular/util/mock-providers";

describe('ReportIssuesComponent Component', () => {
    let component: ReportIssuesComponent;
    let fixture: ComponentFixture<ReportIssuesComponent>;
    let viewControllerMock = mockView();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReportIssuesComponent, PBHorizontal],
            imports: [
                IonicModule.forRoot(ReportIssuesComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule,
                DirectivesModule,
            ],
            providers: [
                ContentService, TelemetryService, TelemetryGeneratorService,
                CommonUtilService,
                { provide: NavController, useClass: NavControllerMock },
                { provide: ViewController, useValue: viewControllerMock },
                { provide: NavParams, useClass: NavParamsMockNew },
                // { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock }
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportIssuesComponent);
        component = fixture.componentInstance;
    });



    it('#submit should Invoke flag content API', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(contentService, 'flagContent').and.callFake((ag, success) => {
            return success();
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        spyOn(commonUtilService, 'showToast');
        component.options = mockRes.reportOptions;
        component.content = { identifier: "SAMPLE_ID", versionKey: "12345" }
        component.userId = "SAMPLE_USER_ID"
        component.submit(mockRes.values);
        const option = {
            contentId: 'SAMPLE_ID',
            flagReasons: ['Copyright Violation', 'Inappropriate Content'],
            flaggedBy: 'SAMPLE_USER_ID',
            versionKey: '12345',
            flags: ['SAMPLE_COMMENT']
        }
        expect(contentService.flagContent).toHaveBeenCalled();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('CONTENT_FLAGGED_MSG');

    });

    it('#submit should handle error scenarios came from flag content', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(contentService, 'flagContent').and.callFake((ag, success, error) => {
            return error();
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        spyOn(commonUtilService, 'showToast');
        component.options = mockRes.reportOptions;
        component.content = { identifier: "SAMPLE_ID", versionKey: "12345" }
        component.userId = "SAMPLE_USER_ID"
        component.submit(mockRes.values);
        const option = {
            contentId: 'SAMPLE_ID',
            flagReasons: ['Copyright Violation', 'Inappropriate Content'],
            flaggedBy: 'SAMPLE_USER_ID',
            versionKey: '12345',
            flags: ['SAMPLE_COMMENT']
        }
        expect(contentService.flagContent).toHaveBeenCalled();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('CONTENT_FLAG_FAIL');

    });

    it('#submit should show warning toast if there are no reasons while submitting', () => {
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        component.options = mockRes.reportOptions;
        component.content = { identifier: "SAMPLE_ID", versionKey: "12345" }
        component.userId = "SAMPLE_USER_ID"
        component.submit(mockRes.allFalsevalues);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_FLAG_CONTENT_MIN_REASON');

    });

    it('#handleBackButton should dismiss the controller', () => {
        const viewController = TestBed.get(ViewController);
        spyOn(viewController, 'dismiss');
        const platform = TestBed.get(Platform);
        spyOn(platform, 'registerBackButtonAction').and.callFake(function (success) {
            return success();
        });
        component.handleDeviceBackButton();
        expect(viewController.dismiss).toHaveBeenCalled();
    });

    it('#getUserId should populate userId', () => {
        const appGlobalService = TestBed.get(AppGlobalService);
        spyOn(appGlobalService, 'getSessionData').and.returnValue(Promise.resolve({userToken:"SAMPLE_USER_ID"}));
        component.getUserId();
        expect(component.userId).toBe('SAMPLE_USER_ID');
    });
});








