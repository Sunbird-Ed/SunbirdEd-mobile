import { async, TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import {
    NavController, Events, IonicModule, NavParams, ToastController, PopoverController,
    LoadingController
} from 'ionic-angular';

import {
    StorageMock, ToastControllerMock, PopoverControllerMock, LoadingControllerMock,
    NetworkMock} from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, ContentService, TelemetryService, CourseService, ShareUtil} from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock, AppGlobalServiceMock
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from "../../component/pbhorizontal/pb-horizontal";
import { OnboardingCardComponent } from '../../component/onboarding-card/onboarding-card';
import { CourseCard } from "../../component/card/course/course-card";
import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import { AppGlobalService } from "../../service/app-global.service";
import { PipesModule } from "../../pipes/pipes.module";
import { HttpClientModule } from "@angular/common/http";
import { DirectivesModule } from "../../directives/directives.module";
import { Ionic2RatingModule } from "ionic2-rating";
import { } from 'jasmine';
import { SunbirdQRScanner } from "../qrscanner/sunbirdqrscanner.service";
import { AppVersion } from "@ionic-native/app-version";
import { QRScannerResultHandler } from "../qrscanner/qrscanresulthandler.service";
import { CommonUtilService } from "../../service/common-util.service";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { FormAndFrameworkUtilService } from "../profile/formandframeworkutil.service";
import { ViewMoreActivityPage } from "./view-more-activity";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CourseUtilService } from "../../service/course-util.service";
describe('ViewMoreActivityPage Component', () => {
    let component: ViewMoreActivityPage;
    let fixture: ComponentFixture<ViewMoreActivityPage>;
    let translateService: TranslateService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewMoreActivityPage, PBHorizontal,
                OnboardingCardComponent,
                CourseCard,
                SignInCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                IonicModule.forRoot(ViewMoreActivityPage),
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
                ContentService, TelemetryService, CourseService, ShareUtil, SunbirdQRScanner,
                Network, AppVersion, QRScannerResultHandler, CommonUtilService, TelemetryGeneratorService,
                CourseUtilService,
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Storage, useFactory: () => StorageMock.instance() },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                // { provide: PageAssembleMock, useClass: PageAssembleMock }

            ]
        })
    }));

    beforeEach(() => {
        const appVersion = TestBed.get(AppVersion);
        spyOn(appVersion, 'getAppName').and.returnValue(Promise.resolve('Sunbird'));
        fixture = TestBed.createComponent(ViewMoreActivityPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        })
    });

    it('should create a valid instance of ViewMoreActivityPage', () => {
        expect(component instanceof ViewMoreActivityPage).toBe(true);
    });




});
