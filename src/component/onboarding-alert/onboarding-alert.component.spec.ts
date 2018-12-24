// import { selectedSlide } from './onboarding-alert.component.data.spec';
// import { NavParamsMock, PlatformMock } from './../../../test-config/mocks-ionic';
// import { TranslateModule } from '@ngx-translate/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { NavParams } from 'ionic-angular';
// import { ViewController } from 'ionic-angular';
// import { Platform } from 'ionic-angular';
// import { OnboardingAlert } from './onboarding-alert';
// import { } from 'jasmine';

// describe('OnboardingAlert', () => {
//     let comp: OnboardingAlert;
//     let fixture: ComponentFixture<OnboardingAlert>;

//     beforeEach(() => {
//         const viewControllerStub = {
//             dismiss: () => ({})
//         };
//         TestBed.configureTestingModule({
//             declarations: [OnboardingAlert],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [TranslateModule.forRoot()],
//             providers: [
//                 { provide: NavParams, useClass: NavParamsMock },
//                 { provide: ViewController, useValue: viewControllerStub },
//                 { provide: Platform, useClass: PlatformMock }
//             ]
//         });
//         const viewControllerMock = TestBed.get(ViewController);
//         const platformStub = TestBed.get(Platform);
//         const navParams = TestBed.get(NavParams);
//         spyOn(viewControllerMock, 'dismiss');
//         spyOn(platformStub, 'registerBackButtonAction');
//         navParams.data = selectedSlide;

//         fixture = TestBed.createComponent(OnboardingAlert);
//         comp = fixture.componentInstance;
//     });

//     it('should load instance', () => {
//         expect(comp).toBeTruthy();
//         expect(comp.selectedSyllabus).toBe('ap_k-12_13');
//     });

//     it('should backButtonFunc defaults to: undefined', () => {
//         expect(comp.backButtonFunc).toEqual(undefined);
//     });

//     it('#onSaveClick should trigger callback save function and close the view', () => {
//         const viewControllerStub: ViewController = fixture.debugElement.injector.get(ViewController);
//         expect(comp.onSaveClick).toBeDefined();
//         spyOn(comp, 'onSaveClick').and.callThrough();

//         comp['callback'] = {
//             save: () => { }
//         };
//         spyOn(comp['callback'], 'save');
//         comp.onSaveClick();
//         expect(comp.onSaveClick).toHaveBeenCalled();
//         expect(comp['callback'].save).toHaveBeenCalled();
//         expect(viewControllerStub.dismiss).toHaveBeenCalled();
//     });

//     it('#cancel makes expected calls', () => {
//         expect(comp.cancel).toBeDefined();
//         const viewControllerStub = TestBed.get(ViewController);
//         spyOn(comp, 'cancel').and.callThrough();
//         comp.cancel();
//         expect(comp.cancel).toHaveBeenCalled();
//         expect(viewControllerStub.dismiss).toHaveBeenCalled();
//     });

//     it('#onSyllabusSelect should make checkmark on select of option', () => {
//         expect(comp.onSyllabusSelect).toBeDefined();
//         spyOn(comp, 'onSyllabusSelect').and.callThrough();
//         comp.onSyllabusSelect(1);
//         expect(comp.onSyllabusSelect).toHaveBeenCalled();
//         expect(comp.selectedSlide.options[1].checked).toBe(true);

//     });
// });
