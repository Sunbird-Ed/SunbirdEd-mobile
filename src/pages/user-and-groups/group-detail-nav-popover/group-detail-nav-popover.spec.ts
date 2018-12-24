// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { NavController } from 'ionic-angular';
// import { NavParams } from 'ionic-angular';
// import { GroupDetailNavPopoverPage } from './group-detail-nav-popover';
// import { TranslateService, TranslateModule } from '@ngx-translate/core';

// describe('GroupDetailNavPopoverPage', () => {
//     let comp: GroupDetailNavPopoverPage;
//     let fixture: ComponentFixture<GroupDetailNavPopoverPage>;

//     beforeEach(() => {
//         const navControllerStub = {};
//         const navParamsStub = {
//             get:  () => {
//                 return ( () => { } );
//             }
//         };
//         const translateServiceStub = {
//             get: () => ({
//                 subscribe: () => ({})
//             })
//         };
//         TestBed.configureTestingModule({
//             declarations: [GroupDetailNavPopoverPage],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [TranslateModule.forRoot()],
//             providers: [
//                 { provide: NavController, useValue: navControllerStub },
//                 { provide: NavParams, useValue: navParamsStub },
//                 { provide: TranslateService, useValue: translateServiceStub },

//             ]
//         });
//         fixture = TestBed.createComponent(GroupDetailNavPopoverPage);
//         comp = fixture.componentInstance;
//     });

//     it('can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('noUsers defaults to: false', () => {
//         expect(comp.noUsers).toEqual(true);
//     });

//     it('It should navigate to editgroup page', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'goToEditGroup').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.goToEditGroup();
//         expect(comp.goToEditGroup).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });

//     it('It should fetch deleteGroup param', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'deleteGroup').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.deleteGroup();
//         expect(comp.deleteGroup).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });
//     it('It should read addUser param', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'addUsers').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.addUsers();
//         expect(comp.addUsers).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });
//     it('It should read removeuser param', () => {
//         const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
//         spyOn(comp, 'removeUser').and.callThrough();
//         spyOn(navParamsStub, 'get').and.callThrough();
//         comp.removeUser();
//         expect(comp.removeUser).toHaveBeenCalled();
//         expect(navParamsStub.get).toHaveBeenCalled();
//     });
// });
