import { ProfileType, ImpressionType, PageId, Environment } from 'sunbird';
import { Observable } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import { NgZone } from '@angular/core';
import { NavController, NavParams, Platform, Events, PopoverController } from 'ionic-angular';
import {  ProfileService, SharedPreferences, ServiceProvider, TelemetryService, AuthService,
     BuildParamService, FrameworkService, ContentService, Profile } from 'sunbird';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { QrCodeResultPage } from './qr-code-result';
import { mockRes } from './qr-code-result.spec.data';
import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, PopoverControllerMock, AuthServiceMock, EventsMock,
    NavMock, NavParamsMock, ProfileServiceMock, SharedPreferencesMock, FormAndFrameworkUtilServiceMock, AppGlobalServiceMock,
    ContentServiceMock
} from '../../../test-config/mocks-ionic';
// import { ComponentsModule } from '../../component/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { Navbar } from 'ionic-angular';
import { doesNotThrow } from 'assert';
import { CommonUtilService } from '../../service/common-util.service';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

describe('QrCodeResultPage', () => {
    let comp: QrCodeResultPage;
    let fixture: ComponentFixture<QrCodeResultPage>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), PipesModule],
            declarations: [ QrCodeResultPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                TelemetryGeneratorService, Platform, ServiceProvider, TelemetryService, BuildParamService, FrameworkService,
                ContentService, AppGlobalService, Navbar, CommonUtilService,
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: NavController, useClass: NavMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Events, useClass: EventsMock },
                { provide: ProfileService, useClass: ProfileServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                // { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
            ]
        });
        fixture = TestBed.createComponent(QrCodeResultPage);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('#ionViewWillEnter should make expected calls', () => {
        spyOn(comp, 'getChildContents');
        comp.ionViewWillEnter();
        expect(comp.getChildContents).toHaveBeenCalled();
    });

    xit('#ionViewDidLoad should make expected calls', () => {
        const telemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
        comp.ionViewDidLoad();
        expect(telemetryGeneratorServiceStub.generateImpressionTelemetry)
        .toHaveBeenCalledWith(ImpressionType.VIEW, '', PageId.DIAL_CODE_SCAN_RESULT, Environment.HOME);
    });

    it('#getChildContents should handle success scenario', () => {
        const contentServiceStub = TestBed.get(ContentService);
        const appGlobalServiceStub = TestBed.get(AppGlobalService);
        comp.identifier = 'sample identifier';
        spyOn(appGlobalServiceStub, 'getCurrentUser').and.returnValue(mockRes.profile);
        spyOn(comp, 'checkProfileData');
        spyOn<any>(comp, 'findContentNode');
        spyOn(contentServiceStub, 'getChildContents').and.callFake((req, success, error) => {
            return success(JSON.stringify(mockRes.getChildContentAPIResponse));
        });
        comp.getChildContents();
        expect(comp.checkProfileData).toHaveBeenCalledWith(mockRes.getChildContentAPIResponse.result.contentData, mockRes.profile);
        expect(comp['findContentNode']).toHaveBeenCalledWith(mockRes.getChildContentAPIResponse.result);
    });

    it('#getChildContents should call Navcontroller pop in the case of failure', () => {
        const contentServiceStub = TestBed.get(ContentService);
        const navcontrollerStub = TestBed.get(NavController);
        comp.identifier = 'sample identifier';
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(navcontrollerStub, 'pop');
        spyOn(contentServiceStub, 'getChildContents').and.callFake((req, success, error) => {
            return error('error');
        });
        comp.getChildContents();
        // expect(comp.showContentComingSoonAlert).toHaveBeenCalled();
        expect(navcontrollerStub.pop).toHaveBeenCalled();
    });

    it('#editProfile should edit the current profile', () => {
        const profileServiceStub = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        comp.profile = mockRes.profile;
        comp.gradeList = mockRes.categoryResponse[2].terms;
        spyOn(profileServiceStub, 'updateProfile').and.callFake((req, res, err) => {
            return res(JSON.stringify(mockRes.profile));
        });
        spyOn(eventsStub, 'publish');
        comp.editProfile();
        expect(eventsStub.publish).toHaveBeenCalledWith(AppGlobalService.USER_INFO_UPDATED);
    });

    it('#setGrade should set grade property of profile', () => {
        const gradeLevel = ['grade5'];
        comp.profile = mockRes.profile;
        comp.setGrade(true, gradeLevel);
        expect(comp.profile.grade.length).toEqual(1);
        expect(comp.profile.gradeValueMap).toEqual({});
    });

    it('#findCode should return the code of the passed category type', () => {
        const contentData = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        contentData.board = 'ICSE';
        const boardList = mockRes.categoryResponse[0].terms;
        expect(comp.findCode(boardList, contentData, 'board')).toEqual('icse');

        contentData.board = 'test';
        expect(comp.findCode(boardList, contentData, 'board')).toEqual(undefined);
    });

    it('#setCurrentProfile should handle different switch cases', () => {
        const contentData = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        spyOn(comp, 'setGrade');
        spyOn(comp, 'editProfile');
        comp.profile = mockRes.profile;
        comp.setCurrentProfile(0, contentData);
        expect(comp.setGrade).toHaveBeenCalledWith(true, contentData.gradeLevel);
        expect(comp.editProfile).toHaveBeenCalled();

        comp.setCurrentProfile(1, contentData);
        expect(comp.setGrade).toHaveBeenCalledWith(true, contentData.gradeLevel);
        expect(comp.editProfile).toHaveBeenCalled();

        comp.setCurrentProfile(2, contentData);
        expect(comp.editProfile).toHaveBeenCalled();

        comp.setCurrentProfile(3, contentData);
        expect(comp.setGrade).toHaveBeenCalledWith(false, contentData.gradeLevel);
        expect(comp.editProfile).toHaveBeenCalled();

        comp.setCurrentProfile(4, contentData);
        expect(comp.editProfile).toHaveBeenCalled();
    });

    it('#checkProfileData should not call setCurrentProfile whe all data matches', () => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        expect(comp.setCurrentProfile).not.toHaveBeenCalled();
    });

    it('#checkProfileData should not call getSyllabusList if framework does not exists in contentdata' , () => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        mockContent.framework = '';
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).not.toHaveBeenCalled();

        mockContent.framework = 'ABCD';
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).not.toHaveBeenCalled();
    });

    it('#checkProfileData should call setCurrentProfile with first argument as 0', (done) => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        mockProfile.syllabus = ['abcd'];
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalledWith(mockContent.framework);
            expect(comp.setCurrentProfile).toHaveBeenCalledWith(0, mockContent);
            done();
        }, 100);
    });

    it('#checkProfileData should call setCurrentProfile with first argument as 1', (done) => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        // comp.profile = mockProfile;
        mockProfile.board = ['sample1', 'sample2'];
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalled();
            expect(comp.setCurrentProfile).toHaveBeenCalledWith(1, mockContent);
            done();
        }, 100);
    });

    xit('#checkProfileData should call setCurrentProfile with first argument as 2', (done) => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        mockProfile.medium = ['abcd'];
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalled();
            expect(comp.setCurrentProfile).toHaveBeenCalledWith(2, mockContent);
            done();
        }, 100);
    });

    xit('#checkProfileData should call setCurrentProfile with first argument as 3', (done) => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        mockProfile.grade = ['abcd'];
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalled();
            expect(comp.setCurrentProfile).toHaveBeenCalledWith(3, mockContent);
            done();
        }, 100);
    });

    xit('#checkProfileData should call setCurrentProfile with first argument as 4', (done) => {
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        // spyOn(comp, 'showContentComingSoonAlert');
        spyOn(comp, 'setCurrentProfile');
        const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
        const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
        mockProfile.subject = ['abcd'];
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockRes.syllabusDetailsAPIResponse));
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockRes.categoryResponse));
        comp.checkProfileData(mockContent, mockProfile);
        expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalled();
            expect(comp.setCurrentProfile).toHaveBeenCalledWith(4, mockContent);
            done();
        }, 100);
    });


});
