import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { IonicApp } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ReportService, ServiceProvider, ContentService } from 'sunbird';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GroupReportAlert } from './group-report-alert';
import { NavParamsMock, ViewControllerMock, LoadingControllerMock, PlatformMock,
    TranslateServiceStub, NavControllerMock, NavMock } from '../../../../test-config/mocks-ionic';
import { Observable } from 'rxjs';

describe('GroupReportAlert', () => {
    let comp: GroupReportAlert;
    let fixture: ComponentFixture<GroupReportAlert>;
    beforeEach(() => {

        const IonicAppMock = {
            _modalPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
            _overlayPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
            _toastPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
        };

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [GroupReportAlert],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ReportService, ServiceProvider, ContentService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: Platform, useClass: PlatformMock },
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: TranslateService, useClass: TranslateServiceStub }
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(GroupReportAlert);
        comp = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    describe('getAssessmentByUser', () => {
        it('makes expected calls', (done) => {

            const repostStub = TestBed.get(ReportService);
            comp.assessment = {
                uids: [],
                content_id: 'sample_string',
                qid: 'sample_question_id',
                users: {
                    get: () => {
                        return 'sample_assessment_uid';
                    }
                }
            };
            const responseObj = [{
                result: 50,
                maxScore: 100,
                time: 1000
            }];
            spyOn(repostStub, 'getDetailsPerQuestion').and.returnValue(Promise.resolve(JSON.stringify(responseObj)));
            spyOn(comp, 'convertTotalTime').and.returnValue(10);
            comp.getAssessmentByUser('users');
            setTimeout(() => {
                expect(repostStub.getDetailsPerQuestion).toHaveBeenCalled();
                done();
            }, 10);
        });
        it('makes expected calls', (done) => {
            const repostStub = TestBed.get(ReportService);
            comp.assessment = {
                uids: [],
                content_id: 'sample_string',
                qid: 'sample_question_id',
                users: {}
            };
            const responseObj = {
                result: 50,
                maxScore: 100,
                time: 1000
            };
            spyOn(repostStub, 'getDetailsPerQuestion').and.returnValue(Promise.reject(JSON.stringify(responseObj)));

            comp.getAssessmentByUser('users');
            setTimeout(() => {
                expect(repostStub.getDetailsPerQuestion).toHaveBeenCalled();
                done();
            }, 10);
        });

    });
    describe('cancel', () => {
        it('makes expected calls', () => {
            const viewCtrlStub = TestBed.get(ViewController);
            spyOn(viewCtrlStub, 'dismiss').and.returnValue(Promise.resolve('success'));
            comp.cancel();

            expect(comp.cancel).toBeDefined();
            expect(viewCtrlStub.dismiss).toHaveBeenCalled();
        });
    });
    it('ionViewWillEnter', () => {
        const platformStub = TestBed.get(Platform);
        spyOn(platformStub, 'registerBackButtonAction').and.callFake((fun: Function, num) => {
            return fun();
        });
        comp.ionViewWillEnter();
        // expect(platformStub.registerBackButtonAction).toHaveBeenCalled();

    });
    it('ionViewWillLeave', () => {
        comp.unregisterBackButton = spyOn(comp, 'ionViewWillEnter');
        comp.ionViewWillLeave();
        expect(comp.unregisterBackButton).toHaveBeenCalled();
    });
    describe('dismissPopUp', () => {
        it('makes expected calls when ionic app is in _modal portal', () => {
            const ionicAppStub = fixture.debugElement.injector.get(IonicApp);

            spyOn(ionicAppStub._modalPortal, 'getActive');
            comp.dismissPopup();

            expect(ionicAppStub._modalPortal.getActive).toHaveBeenCalled();

        });
        it('makes expected calls when ionic app is in _overalay portal', () => {
            const ionicAppStub = fixture.debugElement.injector.get(IonicApp);
            const navStub = TestBed.get(NavController);

            spyOn(ionicAppStub._overlayPortal, 'getActive').and.returnValue(false);
            spyOn(ionicAppStub._modalPortal, 'getActive').and.returnValue(false);
            spyOn(navStub, 'pop');
            comp.dismissPopup();

            expect(ionicAppStub._overlayPortal.getActive).toHaveBeenCalled();
            expect(navStub.pop).toHaveBeenCalled();
        });
    });

    describe('convertTotalTime', () => {
        it('makes expected calls', () => {
            spyOn(Math, 'floor');
            comp.convertTotalTime(1);
            expect(comp.convertTotalTime(1)).toBeDefined();
        });
    });
});
