import { ConfirmAlertComponent } from './confirm-alert';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlatformMock, ViewControllerMock } from '../../../test-config/mocks-ionic';
// /import { ViewControllerMock } from 'ionic-mocks';

describe('Confirm-alert.component', () => {
    let comp: ConfirmAlertComponent;
    let fixture: ComponentFixture<ConfirmAlertComponent>;

    beforeEach(() => {
        const viewControllerStub = {
            dismiss: () => ({})
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ConfirmAlertComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ViewController, useValue: viewControllerStub },
                { provide: Platform, useClass: PlatformMock }
            ]
        });

        const viewControllerMock = TestBed.get(ViewController);
        const platformStub = TestBed.get(Platform);
        spyOn(viewControllerMock, 'dismiss');
        spyOn(platformStub, 'registerBackButtonAction');
        //ConfirmAlertComponent.prototype.backButtonFunc = jasmine.any(Function);
        //sspyOn(ConfirmAlertComponent.prototype, 'backButtonFunc').and.returnValue(jasmine.any(Function));
        fixture = TestBed.createComponent(ConfirmAlertComponent);
        comp = fixture.componentInstance;
    });

    it('should create instance of the ConfirmAlertComponent', () => {
        expect(comp).toBeTruthy();

        //expect(comp.backButtonFunc).toEqual(jasmine.any(Function));
        //expect(comp.backButtonFunc).toBeUndefined();
    });

    it('should dismiss this popup and it should pass argument as false by default', () => {
        expect(comp.selectOption).toBeDefined();
        spyOn(comp, 'selectOption').and.callThrough();

        const viewControllerMock = TestBed.get(ViewController);
        comp.selectOption();
        expect(comp.selectOption).toHaveBeenCalled();
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
        expect(viewControllerMock.dismiss).toHaveBeenCalledWith(false);
    });

    it('should dismiss this popup and it should pass argument which is passed to the selectOption', () => {
        expect(comp.selectOption).toBeDefined();
        spyOn(comp, 'selectOption').and.callThrough();

        const viewControllerMock = TestBed.get(ViewController);
        comp.selectOption(true);
        expect(comp.selectOption).toHaveBeenCalled();
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
        expect(viewControllerMock.dismiss).toHaveBeenCalledWith(true);
    });
});