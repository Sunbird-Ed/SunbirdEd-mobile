// import { NavController, NavParams } from 'ionic-angular';

// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';

// import { PopoverPage } from './popover';

// describe('PopoverPage', () => {
//     let comp: PopoverPage;
//     let fixture: ComponentFixture<PopoverPage>;

//     beforeEach(() => {

//         const navControllerStub = {};
//         const navParamsStub = {
//             get: () => {
//                 return ( () => { } );
//             }
//         };

//         const translateServiceStub = {
//             get: () => ({
//                 subscribe: () => ({})
//             })
//         };
//         TestBed.configureTestingModule({
//             declarations: [PopoverPage],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [TranslateModule.forRoot()],
//             providers: [
//                 { provide: NavController, useValue: navControllerStub },
//                 { provide: NavParams, useValue: navParamsStub },
//                 { provide: TranslateService, useValue: translateServiceStub },

//             ]
//         });
//         fixture = TestBed.createComponent(PopoverPage);
//         comp = fixture.componentInstance;
//     });

//     it('can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('isCurrentUser defaults to: false', () => {
//         expect(comp.isCurrentUser).toEqual(true);
//     });
//     it('It should fetch delete param', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'delete').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.delete();
//         expect(comp.delete).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });
//     it('It should fetch the edit param', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'edit').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.edit();
//         expect(comp.edit).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });
//     it('It should call the ionViewDidLoad method', () => {

//         spyOn(comp, 'ionViewDidLoad').and.callThrough();
//         comp.ionViewDidLoad();
//         expect(comp.ionViewDidLoad).toHaveBeenCalled();

//     });

// });
