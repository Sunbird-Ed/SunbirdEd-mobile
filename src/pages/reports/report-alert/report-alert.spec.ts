import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { IonicApp } from 'ionic-angular';
import { ReportAlert } from './report-alert';
import { TranslateModule } from '@ngx-translate/core';
import { } from 'jasmine';
import { NavParamsMock, ViewControllerMock, NavMock, PlatformMock } from '../../../../test-config/mocks-ionic';

describe('ReportAlert', () => {
    let comp: ReportAlert;
    let fixture: ComponentFixture<ReportAlert>;

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
            declarations: [ReportAlert],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: NavController, useClass: NavMock },
                { provide: Platform, useClass: PlatformMock },
                { provide: IonicApp, useValue: IonicAppMock }
            ]
        });
        fixture = TestBed.createComponent(ReportAlert);
        comp = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    it('Cancel should makes expected calls', () => {
        const viewCtrlStub = TestBed.get(ViewController);
        spyOn(viewCtrlStub, 'dismiss').and.returnValue(Promise.resolve('success'));
        comp.cancel();

        expect(comp.cancel).toBeDefined();
        expect(viewCtrlStub.dismiss).toHaveBeenCalled();
    });
    it('ionViewWillEnter should makes expected calls', () => {
        const platformStub = TestBed.get(Platform);
        spyOn(platformStub, 'registerBackButtonAction').and.callFake((fun: Function, num) => {
            return fun();
        });
        comp.ionViewWillEnter();
        // expect(platformStub.registerBackButtonAction).toHaveBeenCalled();

    });
    it('ionViewWillLeave should makes expected calls', () => {
        comp.unregisterBackButton = spyOn(comp, 'ionViewWillEnter');
        comp.ionViewWillLeave();
        expect(comp.unregisterBackButton).toHaveBeenCalled();
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
